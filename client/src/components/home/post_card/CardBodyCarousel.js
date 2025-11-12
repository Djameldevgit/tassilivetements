import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    // Memoized authentication check
    const isAuthenticated = useMemo(() => !!auth.token, [auth.token]);

    // Like/Unlike effects and handlers
    useEffect(() => {
        if (auth.user) {
            setIsLike(post.likes.some(like => like._id === auth.user._id));
        }
    }, [post.likes, auth.user]);

    const handleLikeToggle = useCallback(async () => {
        if (!isAuthenticated) return setShowModal(true);
        if (loadLike) return;

        setLoadLike(true);
        const action = isLike ? unLikePost : likePost;
        await dispatch(action({ post, auth, socket, t, languageReducer }));
        setLoadLike(false);
    }, [isLike, loadLike, isAuthenticated, dispatch, post, auth, socket, t, languageReducer]);

    // Save/Unsave effects and handlers
    useEffect(() => {
        if (auth.user) {
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

    // Memoized styles for better performance
    const iconButtonStyle = useMemo(() => ({
        cursor: 'pointer',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease-in-out',
        ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.05)'
        }
    }), []);

    const containerStyle = useMemo(() => ({
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden'
    }), []);

    const absoluteButtonStyle = useMemo(() => ({
        position: 'absolute',
        zIndex: 10,
        cursor: 'pointer'
    }), []);

    if (!post.images || post.images.length === 0) {
        return null;
    }

    return (
        <div className="card_body">
            <div className="carousel-container" style={containerStyle}>
                {/* Save Button */}
                <div
                    style={{
                        ...absoluteButtonStyle,
                        top: '12px',
                        right: '12px',
                        ...iconButtonStyle
                    }}
                    onClick={handleSaveToggle}
                    title={saved ? t("unsave", { lng: languageReducer.language }) : t("save", { lng: languageReducer.language })}
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

                {/* Like Button with Count */}
                <div
                    style={{
                        ...absoluteButtonStyle,
                        top: '12px',
                        left: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '20px',
                            padding: '4px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                        }}
                    >
                        <span
                            style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#e74c3c'
                            }}
                        >
                            {post.likes.length}
                        </span>

                        <div
                            style={iconButtonStyle}
                            onClick={handleLikeToggle}
                            title={isLike ? t("unlike", { lng: languageReducer.language }) : t("like", { lng: languageReducer.language })}
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

                {/* Carousel */}
                <div 
                    className="card__image" 
                    onClick={handleNavigateToPost}
                    style={{ cursor: 'pointer' }}
                >
                    <Carousel images={post.images} id={post._id} />
                </div>
            </div>

            {/* Auth Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h4>{t("authentication_required", { lng: languageReducer.language })}</h4>
                        <p>{t("please_login_to_continue", { lng: languageReducer.language })}</p>
                        <div className="modal-actions">
                            <button 
                                className="btn-primary" 
                                onClick={handleNavigateToLogin}
                            >
                                {t("login", { lng: languageReducer.language })}
                            </button>
                            <button 
                                className="btn-secondary"
                                onClick={handleNavigateToRegister}
                            >
                                {t("register", { lng: languageReducer.language })}
                            </button>
                            <button 
                                className="btn-outline"
                                onClick={handleCloseModal}
                            >
                                {t("cancel", { lng: languageReducer.language })}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(CardBodyCarousel);