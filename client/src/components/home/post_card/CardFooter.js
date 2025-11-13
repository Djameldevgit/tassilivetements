import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaComment, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
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

        try {
            localStorage.setItem('currentPost', JSON.stringify(post));
        } catch (error) {
            console.log("Error guardando en localStorage:", error);
        }

        history.push('/map', { 
            postData: post 
        });
        
        console.log("📍 Navegando al mapa con post:", post);
    };

    return (
        <Card.Footer className="border-0 p-0 bg-white">
            <ListGroup variant="flush">
                
                {/* FILA 1: TÍTULO */}
                <ListGroup.Item className="border-0 px-1 py-1">
                    <h6 
                        className="mb-0 fw-bold text-truncate"
                        style={{ fontSize: '15px' }}
                        title={post.title}
                    >
                        {post.title}
                    </h6>
                </ListGroup.Item>

                {/* FILA 2: PRECIO - NÚMERO ROJO A LA IZQUIERDA, "DA" A LA DERECHA */}
                <ListGroup.Item className="border-0 px-1 py-1">
                    <div className="d-flex justify-content-between align-items-center">
                        {/* Número en rojo */}
                        {post.price && (
                            <span 
                                className="fw-bold"
                                style={{ 
                                    fontSize: '16px', 
                                    color: '#dc3545' // Rojo danger
                                }}
                            >
                                {post.price}
                            </span>
                        )}
                        
                        {/* "DA" al extremo derecho */}
                        {post.price && (
                            <span 
                                className="text-muted"
                                style={{ 
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                DA
                            </span>
                        )}
                    </div>
                </ListGroup.Item>

                {/* FILA 3: BOTONES DE CONTACTO SIN BACKGROUND - SOLO COLORES DE TEXTO */}
                <ListGroup.Item className="border-0 px-1 py-1">
                    <div className="d-flex justify-content-between align-items-center gap-3">
                        {/* 1. Teléfono - Solo color de texto */}
                        <div
                            className={`d-flex align-items-center justify-content-center ${
                                post.phone ? 'text-primary' : 'text-muted'
                            }`}
                            style={{
                                width: '30px',
                                height: '30px',
                                cursor: post.phone ? 'pointer' : 'not-allowed'
                            }}
                            onClick={post.phone ? handleCallOwner : undefined}
                            title={post.phone ? "Appeler le vendeur" : "Numéro non disponible"}
                        >
                            <FaPhone size={16} />
                        </div>

                        {/* 2. Chat - Solo color de texto */}
                        <div
                            className="d-flex align-items-center justify-content-center text-success"
                            style={{
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer'
                            }}
                            onClick={handleChatWithOwner}
                            title="Envoyer un message au vendeur"
                        >
                            <FaComment size={16} />
                        </div>

                        {/* 3. Mapa - Solo color de texto */}
                        <div
                            className={`d-flex align-items-center justify-content-center ${
                                (post.location || post.wilaya || post.commune) ? 'text-danger' : 'text-muted'
                            }`}
                            style={{
                                width: '30px',
                                height: '30px',
                                cursor: (post.location || post.wilaya || post.commune) ? 'pointer' : 'not-allowed'
                            }}
                            onClick={(post.location || post.wilaya || post.commune) ? () => handleOpenMap(post) : undefined}
                            title={
                                (post.location || post.wilaya || post.commune) 
                                    ? "Voir sur la carte" 
                                    : "Localisation non disponible"
                            }
                        >
                            <FaMapMarkerAlt size={16} />
                        </div>
                    </div>
                </ListGroup.Item>
            </ListGroup>
        </Card.Footer>
    );
};

export default CardFooter;