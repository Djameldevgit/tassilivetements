const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
 
    createPost: async (req, res) => {
        try {
            const { postData, images } = req.body;
    
            // 🔥 VALIDACIÓN CON FUNCIÓN REUTILIZABLE
            if (!postData) {
                return res.status(400).json({ msg: "Données du post manquantes." });
            }
    
            const validationError = validatePostData(postData);
            if (validationError) {
                return res.status(400).json({ msg: validationError });
            }
    
            // 🔥 VALIDACIÓN DE IMÁGENES PARA NUEVOS POSTS
            if (!images || images.length === 0) {
                return res.status(400).json({ msg: "Veuillez télécharger au moins une image." });
            }
    
            // 🔥 PREPARAR DATOS CON FUNCIÓN REUTILIZABLE
            const postFields = preparePostData(postData, images);
            postFields.user = req.user._id;
    
            // Crear nuevo post
            const newPost = new Posts(postFields);
            await newPost.save();
    
            // Populate para obtener datos del usuario
            await newPost.populate('user', 'avatar username fullname followers');
    
            res.json({
                msg: 'Vêtement publié avec succès!',
                newPost: newPost
            });
    
        } catch (err) {
            console.error('Error en createPost:', err);
            return res.status(500).json({ msg: err.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const { postData, images, existingImages } = req.body;
    
            // 🔥 VALIDACIÓN CON FUNCIÓN REUTILIZABLE
            if (!postData) {
                return res.status(400).json({ msg: "Données du post manquantes." });
            }
    
            const validationError = validatePostData(postData);
            if (validationError) {
                return res.status(400).json({ msg: validationError });
            }
    
            // 🔥 VALIDACIÓN DE IMÁGENES (nuevas + existentes)
            const hasImages = (images && images.length > 0) || 
                             (existingImages && existingImages.length > 0) ||
                             (postData.images && postData.images.length > 0);
            
            if (!hasImages) {
                return res.status(400).json({ msg: "Veuillez télécharger au moins une image." });
            }
    
            // 🔥 PREPARAR DATOS CON FUNCIÓN REUTILIZABLE
            const updateFields = preparePostData(postData, images);
            
            // Si hay imágenes existentes, combinarlas con las nuevas
            if (existingImages && existingImages.length > 0) {
                updateFields.images = [...existingImages, ...(images || [])];
            }
    
            // Buscar y actualizar el post
            const post = await Posts.findOneAndUpdate(
                { _id: req.params.id },
                { $set: updateFields },
                { new: true, runValidators: true }
            );
    
            if (!post) {
                return res.status(400).json({ msg: "Ce vêtement n'existe pas." });
            }
    
            // Populate para obtener datos del usuario
            await post.populate('user', 'avatar username fullname followers');
    
            res.json({
                msg: 'Vêtement modifié avec succès!',
                newPost: post
            });
    
        } catch (err) {
            console.error('Error en updatePost:', err);
            return res.status(500).json({ msg: err.message });
        }
    },
    likePost: async (req, res) => {
        try {
            const post = await Posts.find({_id: req.params.id, likes: req.user._id})
            if(post.length > 0) return res.status(400).json({msg: "You liked this post."})

            const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({msg: 'Liked Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikePost: async (req, res) => {
        try {

            const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({msg: 'UnLiked Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

// ✅ NUEVO ENDPOINT PARA BÚSQUEDA INTELIGENTE
// ✅ NUEVO CONTROLADOR PARA BÚSQUEDA INTELIGENTE DE POSTS
// controllers/postCtrl.js
 
getPosts: async (req, res) => {
    try {
        const { 
            // 🔥 FILTROS PARA ROPA
            subCategory, 
            subSubCategory,
            brand,
            condition,
            gender,
            size,
            color,
            material,
            season,
            location,
            minPrice,
            maxPrice,
            sort
        } = req.query;

        // 🔹 INICIALIZAR QUERY
        const query = {};

        // 🔹 FILTROS DIRECTOS PARA ROPA
        if (subCategory && subCategory.trim() !== "") {
            query.subCategory = { $regex: subCategory.trim(), $options: "i" };
        }

        if (subSubCategory && subSubCategory.trim() !== "") {
            query.subSubCategory = { $regex: subSubCategory.trim(), $options: "i" };
        }

        if (brand && brand.trim() !== "") {
            query.brand = { $regex: brand.trim(), $options: "i" };
        }

        if (condition && condition.trim() !== "") {
            query.condition = { $regex: condition.trim(), $options: "i" };
        }

        if (gender && gender.trim() !== "") {
            query.gender = { $regex: gender.trim(), $options: "i" };
        }

        if (material && material.trim() !== "") {
            query.material = { $regex: material.trim(), $options: "i" };
        }

        if (season && season.trim() !== "") {
            query.season = { $regex: season.trim(), $options: "i" };
        }

        // 🔹 BÚSQUEDA POR TALLA (array)
        if (size && size.trim() !== "") {
            query.sizes = { $in: [new RegExp(size.trim(), "i")] };
        }

        // 🔹 BÚSQUEDA POR COLOR (array)
        if (color && color.trim() !== "") {
            query.colors = { $in: [new RegExp(color.trim(), "i")] };
        }

        // 🔹 BÚSQUEDA POR UBICACIÓN (wilaya, commune, location)
        if (location && location.trim() !== "") {
            const searchLocation = location.trim();
            query.$or = [
                { wilaya: { $regex: searchLocation, $options: "i" } },
                { commune: { $regex: searchLocation, $options: "i" } },
                { location: { $regex: searchLocation, $options: "i" } }
            ];
        }

        // 🔹 FILTRO POR RANGO DE PRECIOS
        if (minPrice || maxPrice) {
            const priceFilter = {};
            
            if (minPrice) {
                const min = parseFloat(minPrice);
                if (!isNaN(min)) {
                    priceFilter.$gte = min;
                }
            }
            
            if (maxPrice) {
                const max = parseFloat(maxPrice);
                if (!isNaN(max)) {
                    priceFilter.$lte = max;
                }
            }
            
            // Solo aplicar filtro si hay precios válidos
            if (Object.keys(priceFilter).length > 0) {
                query.price = priceFilter;
            }
        }

        // 🔥 Mantener paginación con APIfeatures
        const features = new APIfeatures(Posts.find(query), req.query).paginating();

        // ✅ MANEJO DEL SORT
        let sortOption = "-createdAt";
        if (sort && sort === "-createdAt") {
            sortOption = "-createdAt";
        }

        const posts = await features.query
            .sort(sortOption)
            .populate("user likes", "avatar username fullname followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password",
                },
            });

        res.json({
            msg: "Success!",
            result: posts.length,
            posts,
        });
    } catch (err) {
        console.error("Error en getPosts:", err);
        return res.status(500).json({ msg: err.message });
    }
},

    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({user: req.params.id}), req.query)
            .paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
                .populate("user likes", "avatar username followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            if (!post) return res.status(400).json({ msg: req.__('post.post_not_exist') });

            res.json({ post });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },


    viewPost: async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: 'ID inválido' });
            }

            const postUpdated = await Posts.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } },
                { new: true }
            )
                .populate("user likes", "avatar username followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            if (!postUpdated) return res.status(404).json({ msg: 'Post no encontrado' });

            res.json({ post: postUpdated }); // ✅ enviar post completo
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getPostsDicover: async (req, res) => {
        try {

            const newArr = [...req.user.following, req.user._id]

            const num  = req.query.num || 9

            const posts = await Posts.aggregate([
                { $match: { user : { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deletePost: async (req, res) => {
        try {
            const postId = req.params.id;
            const userId = req.user._id;
    
            // 🔷 VERIFICAR SI EL USUARIO ES EL DUEÑO O ADMIN
            const post = await Posts.findById(postId);
            
            if (!post) {
                return res.status(404).json({msg: 'Post not found'});
            }
    
            // Permitir eliminar si es el dueño O admin
            if (post.user.toString() !== userId.toString() && req.user.role !== 'admin') {
                return res.status(403).json({msg: 'Not authorized to delete this post'});
            }
    
            // 🔷 GUARDAR IDs DE COMMENTS Y LIKES ANTES DE ELIMINAR
            const commentsToDelete = post.comments || [];
            const likesToCleanup = post.likes || [];
    
            // 🔷 ELIMINAR EL POST
            await Posts.findByIdAndDelete(postId);
    
            // 🔷 LIMPIAR DATOS RELACIONADOS
            if (commentsToDelete.length > 0) {
                await Comments.deleteMany({_id: {$in: commentsToDelete}});
            }
    
            // 🔷 OPCIONAL: Limpiar likes de usuarios
            if (likesToCleanup.length > 0) {
                await Users.updateMany(
                    {_id: {$in: likesToCleanup}},
                    {$pull: {likes: postId}}
                );
            }
    
            // 🔷 OPCIONAL: Eliminar de posts guardados
            await Users.updateMany(
                {saved: postId},
                {$pull: {saved: postId}}
            );
    
            res.json({
                msg: 'Post deleted successfully!',
                deletedPostId: postId
            });
    
        } catch (err) {
            console.error('Error in deletePost:', err);
            return res.status(500).json({msg: err.message});
        }
    },
    savePost: async (req, res) => {
        try {
            const user = await Users.find({_id: req.user._id, saved: req.params.id})
            if(user.length > 0) return res.status(400).json({msg: "You saved this post."})

            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {saved: req.params.id}
            }, {new: true})

            if(!save) return res.status(400).json({msg: 'This user does not exist.'})

            res.json({msg: 'Saved Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {saved: req.params.id}
            }, {new: true})

            if(!save) return res.status(400).json({msg: 'This user does not exist.'})

            res.json({msg: 'unSaved Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: {$in: req.user.saved}
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = postCtrl