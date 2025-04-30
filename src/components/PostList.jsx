import React, { useRef } from 'react';
import PostItem from './PostItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const PostList = ({ posts, title, remove }) => {
  // Создаем массив refs для всех постов
  const nodeRefs = useRef([]);

  if (!posts.length) {
    return (
      <h1 style={{ textAlign: 'center' }}>
        Посты не найдены!
      </h1>
    );
  }

  nodeRefs.current = posts.map((post, index) => {
    if (nodeRefs.current[index]) {
      return nodeRefs.current[index]; 
    }
    return React.createRef();
  });

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>
        {title}
      </h1>
      <TransitionGroup>
        {posts.map((post, index) => (
          <CSSTransition 
            nodeRef={nodeRefs.current[index]} 
            key={post.id} 
            timeout={500} 
            classNames="post"
          >
            <div ref={nodeRefs.current[index]}>
              <PostItem 
                remove={remove} 
                number={index + 1} 
                post={post} 
                key={post.id}
              />
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default PostList;