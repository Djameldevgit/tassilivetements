const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    // 🔷 CAMPOS BÁSICOS DEL SISTEMA
    content: String,
    title: String,
    images: {
        type: Array,
        required: true
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' },

    // 🔷 CAMPOS PRINCIPALES PARA ROPA
    category: {
        type: String,
        default: "Vêtements"
    },
    subCategory: String,
    subSubCategory: String, // Tipo específico: Hauts & Chemises, Jeans & Pantalons, etc.
    description: String,
    
    // 🔷 INFORMACIÓN DEL PRODUCTO
    brand: String, // Marca: Zara, Nike, etc.
    condition: {
        type: String,
        default: "Nouveau"
    }, // Nouveau, Comme neuf, Bon état, État satisfaisant
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "DZD"
    }, // DZD, EUR, USD
    
    // 🔷 CARACTERÍSTICAS DE ROPA
    sizes: [{
        type: String
    }], // Array de tallas: XS, S, M, L, XL, etc.
    colors: [{
        type: String
    }], // Array de colores: Noir, Blanc, Rouge, etc.
    material: String, // Coton, Polyester, Laine, Soie, etc.
    gender: String, // Homme, Femme, Unisexe, Garçon, Fille, Bébé
    season: {
        type: String,
        default: "Toute l'année"
    }, // Printemps, Été, Automne, Hiver, Toute l'année
    
    // 🔷 UBICACIÓN Y CONTACTO
    wilaya: String,
    commune: String,
    location: String, // Dirección detallada
    phone: {
        type: String,
        required: true
    },
    email: String,
    
    // 🔷 CAMPOS ADICIONALES
    tags: [{
        type: String
    }], // Etiquetas para búsqueda

    // 🔷 META DATOS
    views: { type: Number, default: 0 }

}, {
    timestamps: true
})

// 🔥 ÍNDICES PARA PERFORMANCE - SOLO PARA ROPA

// Índices básicos
postSchema.index({ category: 1, subCategory: 1 })
postSchema.index({ wilaya: 1, commune: 1 })
postSchema.index({ user: 1, createdAt: -1 })

// Índices para búsqueda de ropa
postSchema.index({ subSubCategory: 1 })
postSchema.index({ brand: 1 })
postSchema.index({ condition: 1 })
postSchema.index({ gender: 1 })
postSchema.index({ material: 1 })
postSchema.index({ season: 1 })
postSchema.index({ price: 1 })
postSchema.index({ sizes: 1 }) // Índice para array de tallas
postSchema.index({ colors: 1 }) // Índice para array de colores
postSchema.index({ tags: 1 }) // Índice para array de etiquetas

// Índices compuestos para búsquedas avanzadas de ropa
postSchema.index({ 
    category: 1, 
    subCategory: 1, 
    subSubCategory: 1 
})
postSchema.index({ 
    category: 1, 
    gender: 1, 
    price: 1 
})
postSchema.index({ 
    wilaya: 1, 
    commune: 1, 
    category: 1 
})
postSchema.index({ 
    brand: 1, 
    condition: 1,
    price: 1 
})

module.exports = mongoose.model('post', postSchema)