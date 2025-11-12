import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CardBodyCarousel = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { auth, socket, languageReducer } = useSelector(state => ({
    auth: state.auth,
    socket: state.socket,
    languageReducer: state.languageReducer
  }));

  const { t, i18n } = useTranslation('carousel');
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();

  // 🆕 DETECCIÓN RTL
  const isRTL = i18n.language === 'ar';

  // 🆕 DETECTAR SI ESTAMOS EN PÁGINA DE DETALLE
  const isDetailPage = useMemo(() => {
    return location.pathname.includes('/post/');
  }, [location.pathname]);

  // 🆕 FUNCIÓN PARA ALTURA RESPONSIVE MEJORADA
  const getResponsiveHeight = useCallback(() => {
    if (isDetailPage) {
      // 🆕 Altura más grande para página de detalle
      return 'min(600px, 70vh)'; // Más confiable que clamp
    } else {
      // 🆕 Altura para lista de posts
      return 'min(290px, 50vh)';
    }
  }, [isDetailPage]);
  
 
  const isAuthenticated = useMemo(() => !!auth.token, [auth.token]);

  // Like/Unlike effects and handlers
  useEffect(() => {
    if (auth.user && post.likes) {
      setIsLike(post.likes.some(like => like._id === auth.user._id));
    }
  }, [post.likes, auth.user]);

  const handleLikeToggle = useCallback(async () => {
    if (!isAuthenticated) return setShowModal(true);
    if (loadLike) return;

    setLoadLike(true);
    const action = isLike ? unLikePost : likePost;
    await dispatch(action({ post, auth, socket }));
    setLoadLike(false);
  }, [isLike, loadLike, isAuthenticated, dispatch, post, auth, socket]);

  // Save/Unsave effects and handlers
  useEffect(() => {
    if (auth.user && auth.user.saved) {
      setSaved(auth.user.saved.includes(post._id));
    }
  }, [auth.user, post._id]);

  const handleSaveToggle = useCallback(async () => {
    if (!isAuthenticated) return setShowModal(true);
    if (saveLoad) return;

    setSaveLoad(true);
    const action = saved ? unSavePost : savePost;
    await dispatch(action({ post, auth }));
    setSaveLoad(false);
  }, [saved, saveLoad, isAuthenticated, dispatch, post, auth]);

  // Modal handlers
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  const handleNavigateToLogin = useCallback(() => history.push("/login"), [history]);
  const handleNavigateToRegister = useCallback(() => history.push("/register"), [history]);
  const handleNavigateToPost = useCallback(() => history.push(`/post/${post._id}`), [history, post._id]);

  // 🆕 MEMOIZED STYLES MEJORADOS
  const iconButtonStyle = useMemo(() => ({
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '50%',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease-in-out',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transform: 'scale(1.08)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
    }
  }), []);

  // 🆕 CONTENEDOR CON ALTURA FIJA MEJORADA
  const containerStyle = useMemo(() => ({
    position: 'relative',
    borderRadius: isDetailPage ? '8px' : '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f8f9fa',
    height: getResponsiveHeight(),
    width: '100%'
  }), [getResponsiveHeight, isDetailPage]);

  const absoluteButtonStyle = useMemo(() => ({
    position: 'absolute',
    zIndex: 10,
    cursor: 'pointer'
  }), []);

  // 🆕 ESTILOS PARA EL TEXTO DEL POST
  const textOverlayStyle = useMemo(() => ({
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
    padding: isDetailPage ? '30px 25px 25px' : '20px 16px 16px',
    color: 'white',
    zIndex: 5,
    textAlign: isRTL ? 'right' : 'left',
    direction: isRTL ? 'rtl' : 'ltr'
  }), [isRTL, isDetailPage]);

  const titleStyle = useMemo(() => ({
    fontSize: isDetailPage ? 'clamp(20px, 4vw, 28px)' : 'clamp(14px, 3.5vw, 18px)',
    fontWeight: '700',
    marginBottom: isDetailPage ? '12px' : '6px',
    textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)',
    lineHeight: '1.3',
    color: '#ffffff'
  }), [isDetailPage]);

  const descriptionStyle = useMemo(() => ({
    fontSize: isDetailPage ? 'clamp(16px, 3vw, 18px)' : 'clamp(12px, 3vw, 14px)',
    fontWeight: '400',
    marginBottom: '0',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
    lineHeight: '1.4',
    color: '#f0f0f0',
    opacity: '0.95'
  }), [isDetailPage]);

  const priceStyle = useMemo(() => ({
    fontSize: isDetailPage ? 'clamp(22px, 4.5vw, 28px)' : 'clamp(16px, 4vw, 20px)',
    fontWeight: '800',
    color: '#10b981',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
    marginTop: isDetailPage ? '15px' : '8px',
    direction: 'ltr'
  }), [isDetailPage]);

  // 🆕 VERIFICACIÓN DE IMÁGENES
  const hasImages = useMemo(() => {
    return post.images && Array.isArray(post.images) && post.images.length > 0;
  }, [post.images]);

  if (!hasImages) {
    return (
      <div className="card_body">
        <div style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e9ecef'
        }}>
          <span style={{ color: '#6c757d', fontSize: '16px' }}>
            {t('no_images')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="card_body">
      <div className="carousel-container" style={containerStyle}>
        {/* BOTÓN GUARDAR */}
        <div
          style={{
            ...absoluteButtonStyle,
            top: '12px',
            right: isRTL ? 'auto' : '12px',
            left: isRTL ? '12px' : 'auto',
            ...iconButtonStyle
          }}
          onClick={handleSaveToggle}
          title={saved ? t('buttons.unsave') : t('buttons.save')}
        >
          <span
            className="material-icons"
            style={{
              fontSize: '20px',
              color: saved ? '#ff6b35' : '#666',
              transition: 'color 0.2s ease-in-out'
            }}
          >
            {saved ? 'bookmark' : 'bookmark_border'}
          </span>
        </div>

        {/* BOTÓN LIKE */}
        <div
          style={{
            ...absoluteButtonStyle,
            top: '12px',
            left: isRTL ? 'auto' : '12px',
            right: isRTL ? '12px' : 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '6px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#e74c3c'
              }}
            >
              {post.likes ? post.likes.length : 0}
            </span>

            <div
              style={iconButtonStyle}
              onClick={handleLikeToggle}
              title={isLike ? t('buttons.unlike') : t('buttons.like')}
            >
              <span
                className="material-icons"
                style={{
                  fontSize: '20px',
                  color: isLike ? '#e74c3c' : '#666',
                  transition: 'color 0.2s ease-in-out'
                }}
              >
                favorite
              </span>
            </div>
          </div>
        </div>
 
<div 
    className="card__image" 
    onClick={isDetailPage ? undefined : handleNavigateToPost}
    style={{ 
        cursor: isDetailPage ? 'default' : 'pointer',
        position: 'relative',
        height: getResponsiveHeight(),  
        width: '100%'
    }}
>
  
    <div style={{ 
        height: '100%', 
        width: '100%',
        position: 'relative'
    }}>
        <Carousel 
            images={post.images} 
            id={post._id}
            height="100%" // 🆕 Ahora pasamos 100%
        />
    </div>
    
    {/* OVERLAY DE TEXTO */}
    <div style={textOverlayStyle}>
        <h3 style={titleStyle}>
            {post.title || t('no_title')}
        </h3>
        {post.description && (
            <p style={descriptionStyle}>
                {isDetailPage 
                    ? post.description
                    : (post.description.length > 100 
                        ? `${post.description.substring(0, 100)}...` 
                        : post.description
                      )
                }
            </p>
        )}
        {post.price && (
            <div style={priceStyle}>
                {new Intl.NumberFormat(isRTL ? 'ar-DZ' : 'fr-FR').format(post.price)} 
                {' '}
                {t(`currencies.${post.currency || 'DZD'}`, { defaultValue: post.currency || 'DZD' })}
            </div>
        )}
    </div>
</div></div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              direction: isRTL ? 'rtl' : 'ltr',
              textAlign: isRTL ? 'right' : 'left'
            }}
          >
            <h4>{t('modal.auth_required')}</h4>
            <p>{t('modal.login_to_continue')}</p>
            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={handleNavigateToLogin}
              >
                {t('modal.login')}
              </button>
              <button
                className="btn-secondary"
                onClick={handleNavigateToRegister}
              >
                {t('modal.register')}
              </button>
              <button
                className="btn-outline"
                onClick={handleCloseModal}
              >
                {t('modal.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CardBodyCarousel);