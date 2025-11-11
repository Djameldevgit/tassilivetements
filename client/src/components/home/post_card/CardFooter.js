import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaComment, FaPhone } from 'react-icons/fa';
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
            // Verificar si ya existe una conversación con este usuario
            const existingConversation = message.data.find(item => item._id === post.user._id);
            
            if (existingConversation) {
                // Si ya existe conversación, redirigir directamente
                history.push(`/message/${post.user._id}`);
                return;
            }

            // Crear nuevo usuario en el estado de mensajes
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

            // Redirigir al chat
            history.push(`/message/${post.user._id}`);

            // Mostrar mensaje de éxito
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
        
        // Confirmación antes de llamar
        if (window.confirm(`Voulez-vous appeler ${post.phone} ?`)) {
            window.location.href = `tel:${post.phone}`;
        }
    };

    return (
        <div className="card-footer bg-white border-top px-3 py-2">
            {/* Fila 1: Título */}
            <div className="mb-1">
                <h6 className="fw-bold text-dark mb-0 text-truncate fs-6">
                    {post.title || 'Sans titre'}
                </h6>
            </div>

            {/* Fila 2: Subcategoría */}
            <div className="mb-2">
                <span className="text-muted small">
                    {post.subCategory || 'Général'}
                </span>
            </div>

            {/* Fila 3: Precio */}
            <div className="mb-2">
                <span className="fw-bold text-success fs-5">
                    {post.price || '0'}
                    <small className="text-muted ms-1 fs-6">
                        {post.currency || 'DZD'}
                    </small>
                </span>
            </div>

            {/* Fila 4: Iconos de Contacto - Separados completamente */}
            <div className="d-flex justify-content-between align-items-center w-100 border-top pt-2">
                {/* Icono Teléfono con Texto - Izquierda */}
                <div 
                    className="d-flex align-items-center text-primary"
                    style={{ 
                        cursor: post.phone ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        opacity: post.phone ? 1 : 0.5
                    }}
                    onClick={handleCallOwner}
                    onMouseEnter={(e) => {
                        if (post.phone) {
                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                            e.currentTarget.style.color = '#0056b3';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (post.phone) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#0d6efd';
                        }
                    }}
                    title={post.phone ? "Appeler le vendeur" : "Numéro non disponible"}
                >
                    <FaPhone 
                        style={{ 
                            fontSize: '1.2rem',
                            marginRight: '6px'
                        }}
                    />
                    <span className="small fw-medium">Appeler</span>
                </div>

                {/* Icono Chat con Texto - Derecha */}
                <div 
                    className="d-flex align-items-center text-success"
                    style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        padding: '4px 8px',
                        borderRadius: '6px'
                    }}
                    onClick={handleChatWithOwner}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.color = '#0a3622';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#198754';
                    }}
                    title="Envoyer un message au vendeur"
                >
                    <FaComment 
                        style={{ 
                            fontSize: '1.2rem',
                            marginRight: '6px'
                        }}
                    />
                    <span className="small fw-medium">Message</span>
                </div>
            </div>
        </div>
    );
};

export default CardFooter;