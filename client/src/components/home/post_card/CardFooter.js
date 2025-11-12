import React from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { FaComment, FaPhone, FaTag, FaLayerGroup, FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const CardFooter = ({ post }) => {
    const { auth, message } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleChatWithOwner = () => {
        if (!auth.user) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Veuillez vous connecter pour démarrer une conversation' } 
            });
            return;
        }

        if (!post.user || !post.user._id) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Impossible de contacter ce vendeur' } 
            });
            return;
        }

        try {
            const existingConversation = message.data.find(item => item._id === post.user._id);
            
            if (existingConversation) {
                history.push(`/message/${post.user._id}`);
                return;
            }

            dispatch({
                type: MESS_TYPES.ADD_USER,
                payload: { 
                    ...post.user, 
                    text: '', 
                    media: [],
                    postTitle: post.title || 'Produit de mode',
                    postId: post._id
                }
            });

            history.push(`/message/${post.user._id}`);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: 'Conversation démarrée avec le vendeur' }
            });

        } catch (error) {
            console.error('Erreur lors du démarrage de la conversation:', error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: 'Erreur lors du démarrage de la conversation' }
            });
        }
    };

    const handleCallOwner = () => {
        if (!post.phone) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Numéro de téléphone non disponible' } 
            });
            return;
        }
        
        if (window.confirm(`Voulez-vous appeler ${post.phone} ?`)) {
            window.location.href = `tel:${post.phone}`;
        }
    };

    const handleOpenMap = () => {
        if (!post.location && !post.wilaya && !post.commune) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Aucune information de localisation disponible' } 
            });
            return;
        }

        // 🆕 GUARDAR EN LOCALSTORAGE COMO BACKUP
        try {
            localStorage.setItem('currentPost', JSON.stringify(post));
        } catch (error) {
            console.log("Error guardando en localStorage:", error);
        }

        // 🆕 NAVEGAR AL MAPA PASANDO EL POST COMO STATE
        history.push('/map', { 
            postData: post 
            // También puedes usar solo 'post' si prefieres:
            // post: post
        });
        
        console.log("📍 Navegando al mapa con post:", post);
    };

    return (
        <Card.Footer className="border-0 p-0 bg-white">
        <ListGroup variant="flush">
         

            {/* Botones de acción - SUPER COMPACTOS */}
            <ListGroup.Item className="border-0 px-1 py-1">
    <div className="d-flex justify-content-between align-items-center gap-3">
        {/* 1. Teléfono */}
        <div
            className={`d-flex align-items-center justify-content-center ${
                post.phone ? 'text-primary' : 'text-muted'
            }`}
            style={{
                width: '30px',
                height: '30px',
                cursor: post.phone ? 'pointer' : 'not-allowed',
                borderRadius: '50%',
                transition: 'all 0.2s'
            }}
            onClick={post.phone ? handleCallOwner : undefined}
            onMouseEnter={(e) => {
                if (post.phone) e.currentTarget.style.backgroundColor = '#f8f9fa';
            }}
            onMouseLeave={(e) => {
                if (post.phone) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={post.phone ? "Appeler le vendeur" : "Numéro non disponible"}
        >
            <FaPhone size={15} />
        </div>

        {/* 2. Chat */}
        <div
            className="d-flex align-items-center justify-content-center text-success"
            style={{
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                borderRadius: '50%',
                transition: 'all 0.2s'
            }}
            onClick={handleChatWithOwner}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Envoyer un message au vendeur"
        >
            <FaComment size={15} />
        </div>
 
<div
    className={`d-flex align-items-center justify-content-center ${
        (post.location || post.wilaya || post.commune) ? 'text-danger' : 'text-muted'
    }`}
    style={{
        width: '30px',
        height: '30px',
        cursor: (post.location || post.wilaya || post.commune) ? 'pointer' : 'not-allowed',
        borderRadius: '50%',
        transition: 'all 0.2s'
    }}
    onClick={(post.location || post.wilaya || post.commune) ? () => handleOpenMap(post) : undefined}
    onMouseEnter={(e) => {
        if (post.location || post.wilaya || post.commune) e.currentTarget.style.backgroundColor = '#f8f9fa';
    }}
    onMouseLeave={(e) => {
        if (post.location || post.wilaya || post.commune) e.currentTarget.style.backgroundColor = 'transparent';
    }}
    title={
        (post.location || post.wilaya || post.commune) 
            ? "Voir sur la carte" 
            : "Localisation non disponible"
    }
>
    <FaMapMarkerAlt size={15} />
</div>
    </div>
</ListGroup.Item>
        </ListGroup>
    </Card.Footer>
);
};

export default CardFooter;

 