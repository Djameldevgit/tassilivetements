import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import ShareModal from './ShareModal';
import { deletePost } from '../../../redux/actions/postAction';
import { CardBody } from "react-bootstrap";
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const CardBodyTitle = ({ post }) => {
    const location = useLocation();
    const history = useHistory();
    const { t, i18n } = useTranslation(['cardtitle', 'categories', 'descripcion', 'common']);
    const { auth, socket } = useSelector(state => state);
    const dispatch = useDispatch();

    const isRTL = i18n.language === 'ar' || i18n.language === 'ara';
    const isDetailPage = location.pathname === `/post/${post._id}`;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const lang = i18n.language === 'ar' ? 'ar' : 'fr';
        moment.locale(lang);
    }, [i18n.language]);

    const isSuperUtilisateur = auth.user?.role === "Super-utilisateur";
    const isAdmin = auth.user?.role === "admin";
    const isPostOwner = auth.user && post && auth.user._id === post.user?._id;
    const hasAdminRights = isSuperUtilisateur || isAdmin;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.dropdown-container')) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDropdown]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return moment(dateString).format('DD/MM/YYYY');
    };

    const getDayName = (dateString) => {
        if (!dateString) return '';
        const days = {
            'Monday': t('days.monday', 'Lun'),
            'Tuesday': t('days.tuesday', 'Mar'),
            'Wednesday': t('days.wednesday', 'Mer'),
            'Thursday': t('days.thursday', 'Jeu'),
            'Friday': t('days.friday', 'Ven'),
            'Saturday': t('days.saturday', 'Sam'),
            'Sunday': t('days.sunday', 'Dim')
        };
        const day = moment(dateString).format('dddd');
        return days[day] || day;
    };

    const getSubCategoryIcon = (subCategory) => {
        const icons = {
            'Homme': '👔',
            'Femme': '👗',
            'Enfant': '👶',
            'Accessoires': '👜',
            'Chaussures': '👠',
            'Sport': '👕',
            'Luxe': '💎',
            'Vintage': '🕰️',
            'Été': '☀️',
            'Hiver': '❄️'
        };
        return icons[subCategory] || '🏪';
    };

    const translateSubCategory = (subCategory) => {
        const translations = {
            'Homme': t('categories.homme', 'Homme'),
            'Femme': t('categories.femme', 'Femme'),
            'Enfant': t('categories.enfant', 'Enfant'),
            'Accessoires': t('categories.accessoires', 'Accessoires'),
            'Chaussures': t('categories.chaussures', 'Chaussures'),
            'Sport': t('categories.sport', 'Sport'),
            'Luxe': t('categories.luxe', 'Luxe'),
            'Vintage': t('categories.vintage', 'Vintage'),
            'Été': t('categories.ete', 'Été'),
            'Hiver': t('categories.hiver', 'Hiver')
        };
        return translations[subCategory] || subCategory || t('noCategory', 'Sans catégorie');
    };

    const handleDestinationClick = (e) => {
        e.stopPropagation();
        history.push('/map', { postData: post, from: 'Boutique' });
    };

    const handleSubCategoryClick = (e) => {
        e.stopPropagation();
        if (auth.user) setShowDropdown(!showDropdown);
    };

    const handleChatWithStore = () => {
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }

        if (!post.user || !post.user._id) {
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('store.contactError', 'Impossible de contacter cette boutique') }
            });
            return;
        }

        try {
            dispatch({
                type: MESS_TYPES.ADD_USER,
                payload: { ...post.user, text: '', media: [] }
            });

            history.push(`/message/${post.user._id}`);
            setShowDropdown(false);

            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { success: t('store.chatStarted', 'Chat iniciado con la boutique') }
            });

        } catch (error) {
            console.error('Error al iniciar chat con boutique:', error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('store.chatError', 'Error al iniciar el chat') }
            });
        }
    };

    const handleViewStoreProfile = () => {
        if (!post.user || !post.user._id) {
            alert(t('store.profileError', 'Impossible de voir le profil de cette boutique'));
            return;
        }
        history.push(`/profile/${post.user._id}`);
        setShowDropdown(false);
    };

    const handleEditPost = () => {
        if (!auth.user) { setShowAuthModal(true); return; }
        history.push('/createpost', { isEdit: true, postData: post });
        dispatch({ type: 'GLOBALTYPES.STATUS', payload: { ...post, onEdit: true } });
        setShowDropdown(false);
    };

    const handleDeletePost = async () => {
        if (!auth.user) { setShowAuthModal(true); return; }
        if (window.confirm(t('post.deleteConfirmation', 'Êtes-vous sûr de vouloir supprimer cette publication?'))) {
            setIsDeleting(true);
            try { await dispatch(deletePost({ post, auth, socket })); }
            catch (error) { console.error('Error al eliminar el post:', error); }
            finally { setIsDeleting(false); setShowDropdown(false); }
        }
    };

    const handleFollowStore = () => {
        console.log("Seguir boutique:", post.user?._id);
        setShowDropdown(false);
    };

    const handleSharePost = () => {
        setShowShareModal(true);
        setShowDropdown(false);
    };

    const handleViewDetails = () => {
        history.push(`/post/${post._id}`);
        setShowDropdown(false);
    };

    const getDropdownOptions = () => {
        const options = [];

        if (hasAdminRights) {
            options.push(
                { icon: "create", text: t('editPost', 'Modifier le post'), action: handleEditPost },
                { icon: "delete_outline", text: t('deletePost', 'Supprimer le post'), action: handleDeletePost }
            );
        }

        if (isPostOwner) {
            options.push(
                { icon: "create", text: t('editPost', 'Modifier le post'), action: handleEditPost },
                { icon: "delete_outline", text: t('deletePost', 'Supprimer le post'), action: handleDeletePost }
            );
        }

        if (auth.user) {
            options.push(
                { icon: "chat", text: t('writeToStore', 'Écrire à la boutique'), action: handleChatWithStore },
                { icon: "person", text: t('viewStoreProfile', 'Voir profil boutique'), action: handleViewStoreProfile },
                { icon: "share", text: t('sharePost', 'Partager'), action: handleSharePost },
                { icon: "info", text: t('viewDetails', 'Voir détails'), action: handleViewDetails }
            );

            if (!isPostOwner) {
                options.push(
                    { icon: "person_add", text: t('followStore', 'Suivre la boutique'), action: handleFollowStore }
                );
            }
        }

        return options.filter((option, index, self) =>
            index === self.findIndex(o => o.text === option.text)
        );
    };

    const dropdownOptions = getDropdownOptions();
    const handleOptionClick = (action) => { action(); setShowDropdown(false); };

    const DropdownItem = ({ icon, text, onClick, isDanger = false }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '14px',
            color: isDanger ? '#e53e3e' : '#4a5568',
            flexDirection: isRTL ? 'row-reverse' : 'row'
        }}
            onClick={onClick}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <span className="material-icons" style={{
                fontSize: '18px',
                width: '20px',
                transform: isRTL ? 'scaleX(-1)' : 'none'
            }}>{icon}</span>
            <span>{text}</span>
        </div>
    );

    const shareUrl = `${window.location.origin}/post/${post._id}`;
    const shareTitle = `${post.title || t('store.offer', 'Offre Boutique')} - ${post.nombretienda || post.user?.username || t('store.name', 'Boutique de Mode')}`;
    const imageUrl = post.images?.[0]?.url || post.user?.avatar;

    return (
        <div className="cardtitle" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>

            <CardBody className="card-header" style={{
                padding: '5px 8px',
                borderBottom: '1px solid #e2e8f0',
                background: 'white',
                textAlign: isRTL ? 'right' : 'left'
            }}>
                {!isDetailPage && (
                    <div style={{ width: '100%' }}>
                        {/* 🔥 FILA 1: Subcategoría + Nombre Tienda + Mapa - OPTIMIZADA */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between', // ✅ Distribuye el espacio
                            gap: '6px',
                            marginBottom: '5px',
                            flexWrap: 'wrap',
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }}>

                            {/* LADO IZQUIERDO: Subcategoría + Nombre Tienda */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flex: 1,
                                flexDirection: isRTL ? 'row-reverse' : 'row'
                            }}>
                                {/* SUBCATEGORÍA - OPTIMIZADA */}
                                <div className="dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        cursor: auth.user ? 'pointer' : 'default',
                                        transition: 'all 0.2s',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        padding: '3px 8px',
                                        gap: '5px',
                                        maxWidth: '100%',
                                        overflow: 'hidden'
                                    }}
                                        onClick={handleSubCategoryClick}
                                        onMouseEnter={(e) => { if (auth.user) e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
                                        onMouseLeave={(e) => { if (auth.user) e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                                        title={auth.user ? t('cardbody.moreOptions', 'Plus d\'options') : ''}>
                                        
                                        <span style={{ 
                                            fontSize: '14px',
                                            flexShrink: 0
                                        }}>
                                            {getSubCategoryIcon(post.subCategory)}
                                        </span>
                                        
                                        <span style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {translateSubCategory(post.subCategory)}
                                        </span>
                                        
                                        {auth.user && (
                                            <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`}
                                                style={{
                                                    fontSize: '9px',
                                                    color: '#6b7280',
                                                    flexShrink: 0
                                                }}>
                                            </i>
                                        )}
                                    </div>

                                    {showDropdown && auth.user && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '100%',
                                            [isRTL ? 'left' : 'right']: '0',
                                            marginTop: '4px',
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            minWidth: '200px',
                                            zIndex: 1000,
                                            overflow: 'hidden',
                                            textAlign: isRTL ? 'right' : 'left'
                                        }}
                                            onMouseLeave={() => setShowDropdown(false)}>
                                            {dropdownOptions.map((option, index) => (
                                                <DropdownItem
                                                    key={index}
                                                    icon={option.icon}
                                                    text={option.text}
                                                    onClick={() => handleOptionClick(option.action)}
                                                    isDanger={option.icon === 'delete_outline'}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* NOMBRE TIENDA - NUEVO BOTÓN */}
                                {post.nombretienda && (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        backgroundColor: '#4f46e5',
                                        borderRadius: '10px',
                                        border: '1px solid #4f46e5',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: 'white',
                                        padding: '4px 12px',
                                        gap: '6px',
                                        maxWidth: '100%',
                                        overflow: 'hidden'
                                    }}
                                        onClick={handleViewStoreProfile}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#4338ca';
                                            e.currentTarget.style.borderColor = '#4338ca';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#4f46e5';
                                            e.currentTarget.style.borderColor = '#4f46e5';
                                        }}
                                        title={t('store.viewProfile', 'Voir le profil de la boutique')}>
                                        
                                        <span style={{ 
                                            fontSize: '14px',
                                            flexShrink: 0
                                        }}>
                                            🏪
                                        </span>
                                        
                                        <span style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {post.nombretienda}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* LADO DERECHO: Icono Mapa */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderRadius: '8px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                padding: '6px',
                                flexShrink: 0
                            }}
                                onClick={handleDestinationClick}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f0f9ff';
                                    e.currentTarget.style.borderColor = '#3b82f6';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                                title={t('cardbody.viewOnMap', 'Voir sur la carte')}>

                                <i className="fas fa-map" style={{
                                    color: '#dc2626',
                                    fontSize: '14px'
                                }}></i>
                            </div>
                        </div>
 
                        
                        
                        </div>
                   
                )}
            </CardBody>

            {/* VISTA DETALLE COMPACTA */}
            {isDetailPage && (
                <div className="post-header" style={{
                    padding: '6px 8px',
                    borderBottom: '1px solid #e2e8f0',
                    background: 'white',
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left'
                }}>
                    {/* FILA 1: Subcategoría + Nombre Tienda + Mapa */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        marginBottom: '5px',
                        flexWrap: 'nowrap',
                        flexDirection: isRTL ? 'row-reverse' : 'row',
                        overflow: 'hidden'
                    }}>
                        {/* LADO IZQUIERDO: Subcategoría + Nombre Tienda */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            flex: 1,
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }}>
                            {/* SUBCATEGORÍA */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: '#f8fafc',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#374151',
                                padding: '3px 7px',
                                gap: '4px',
                                maxWidth: '100%',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                <span style={{ 
                                    fontSize: '13px',
                                    flexShrink: 0
                                }}>
                                    {getSubCategoryIcon(post.subCategory)}
                                </span>
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {translateSubCategory(post.subCategory)}
                                </span>
                            </div>

                            {/* NOMBRE TIENDA */}
                            {post.nombretienda && (
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    backgroundColor: '#4f46e5',
                                    borderRadius: '8px',
                                    border: '1px solid #4f46e5',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'white',
                                    padding: '3px 10px',
                                    gap: '4px',
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                }}
                                    onClick={handleViewStoreProfile}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#4338ca';
                                        e.currentTarget.style.borderColor = '#4338ca';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#4f46e5';
                                        e.currentTarget.style.borderColor = '#4f46e5';
                                    }}
                                    title={t('store.viewProfile', 'Voir le profil de la boutique')}>

                                    <span style={{ 
                                        fontSize: '12px',
                                        flexShrink: 0
                                    }}>
                                        🏪
                                    </span>
                                    
                                    <span style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {post.nombretienda}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* LADO DERECHO: Icono Mapa */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderRadius: '8px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            padding: '5px',
                            flexShrink: 0
                        }}
                            onClick={handleDestinationClick}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#f0f9ff';
                                e.currentTarget.style.borderColor = '#3b82f6';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#e2e8f0';
                            }}
                            title={t('cardbody.viewOnMap', 'Voir sur la carte')}>

                            <i className="fas fa-map" style={{
                                color: '#dc2626',
                                fontSize: '12px',
                                flexShrink: 0
                            }}></i>
                        </div>
                    </div>

                    {/* FILA 2: Fecha y Ubicación */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                        fontSize: '11px',
                        color: '#6b7280',
                        flexDirection: isRTL ? 'row-reverse' : 'row'
                    }}>
                        {/* FECHA */}
                        {post.datedepar && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                whiteSpace: 'nowrap',
                                flexDirection: isRTL ? 'row-reverse' : 'row',
                                flexShrink: 0
                            }}>
                                <i className="far fa-calendar" style={{
                                    fontSize: '10px',
                                    color: '#7c3aed',
                                    flexShrink: 0
                                }}></i>
                                <span style={{ fontWeight: '500' }}>
                                    {t('departure', 'Disponible depuis')} {formatDate(post.datedepar)}
                                </span>
                                <span style={{
                                    color: '#9ca3af',
                                    fontSize: '10px'
                                }}>
                                    ({getDayName(post.datedepar)})
                                </span>
                            </div>
                        )}

                        {/* UBICACIÓN */}
                        {post.wilaya && (
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                whiteSpace: 'nowrap',
                                flexDirection: isRTL ? 'row-reverse' : 'row',
                                flexShrink: 0
                            }}>
                                <i className="fas fa-location-pin" style={{
                                    fontSize: '9px',
                                    color: '#059669',
                                    flexShrink: 0
                                }}></i>
                                <span>
                                    {post.wilaya}{post.commune && `, ${post.commune}`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SHAREMODAL */}
            <ShareModal
                show={showShareModal}
                onHide={() => setShowShareModal(false)}
                post={post}
                shareUrl={shareUrl}
                shareTitle={shareTitle}
                imageUrl={imageUrl}
            />

            {/* AUTH MODAL */}
            {showAuthModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        minWidth: '280px',
                        direction: isRTL ? 'rtl' : 'ltr'
                    }}>
                        <h3 style={{
                            marginBottom: '12px',
                            color: '#2d3748',
                            fontSize: '16px'
                        }}>
                            {t('auth.required', 'Authentification Requise')}
                        </h3>
                        <p style={{
                            marginBottom: '16px',
                            color: '#718096',
                            fontSize: '14px'
                        }}>
                            {t('auth.loginToContinue', 'Veuillez vous connecter pour continuer')}
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            flexDirection: isRTL ? 'row-reverse' : 'row'
                        }}>
                            <button onClick={() => history.push('/login')} style={{
                                padding: '8px 16px',
                                backgroundColor: '#4a5568',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}>
                                {t('auth.login', 'Connexion')}
                            </button>
                            <button onClick={() => history.push('/register')} style={{
                                padding: '8px 16px',
                                backgroundColor: '#e2e8f0',
                                color: '#4a5568',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}>
                                {t('auth.register', 'Inscription')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CardBodyTitle;