import React, { useEffect, useState } from 'react';
import './styles/App.css';
import PostList from './components/PostList';
import MyButton from './components/UI/button/MyButton';
import PostForm from './components/PostForm';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/MyModal/MyModal';
import { usePosts } from './hooks/usePosts';
import PostService from './API/PostService';
import Loader from './components/UI/Loader/Loader';
import { useFetching } from './hooks/useFetching';
import axios from 'axios';
import { getPagesArray, getPagesCount } from './components/utils/pages';
function App() {
  const [posts, setPosts] = useState([
    {id: 1, title: 'C++', body: 'Description'},
    {id: 2, title: 'YoptaScript', body: 'Description'},
    {id: 3, title: 'JavaScript', body: 'Description'},
    {id: 4, title: 'Python', body: 'Description'}
  ]);
  const [filter, setFilter] = useState({sort: '', query: ''});
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  let pagesArray = getPagesArray(totalPages);

  const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
    const response = await PostService.getAll(limit, page);
    setPosts(response.data);
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPagesCount(totalCount, limit ))
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const createPost = (newPost) => {
    setPosts([...posts, newPost])
    setModal(false);
  }

  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id))
  }
  
  const changePage = (page) => {
    setPage(page)
    fetchPosts()
  }
  
  return (
    <div className="App">
      <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
        Создать пользователя
      </MyButton>   
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      <PostFilter filter={filter} setFilter={setFilter}/>
      {postError &&
        <h1>Произошла ошибка ${postError}</h1>
      }
      {isPostsLoading
        ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
        : <PostList remove={removePost} posts={sortedAndSearchedPosts} title={'Посты про JS'}/>
      }
      <div className='page__wrapper'>
        {pagesArray.map(p => 
          <span 
            onClick={() => changePage(p)}  
            key={p} 
            className={page === p ? 'page page__current' : 'page'}
          >
            {p}
          </span>
        )}
      </div>
      
    </div>
  );
}

export default App;
