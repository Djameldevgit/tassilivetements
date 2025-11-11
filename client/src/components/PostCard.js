import React from 'react';
import CardBodyCarousel from './home/post_card/CardBodyCarousel';
import CardBodyTitle from './home/post_card/CardBodyTitle';
import CardFooter from './home/post_card/CardFooter';
 
const PostCard = ({ post }) => {
    return (
        <div>
 

            <CardBodyTitle post={post} />

            <CardBodyCarousel post={post} />
         <CardFooter post={post} />
        </div>
    );
};

export default PostCard;