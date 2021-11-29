import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios' ;

function Feed(props){
  const news = props.news;
  //if (Array.isArray(news)==false){
  //return (<p>{"failed to obtain news from server!"}</p>)
  //}

  const listNews = news.map((article,index) =>
    <div className="preview" key={article.title}>
      <div className="preview-text">
        <div className="preview-source"> source </div>
        <div className="preview-title">{article.title}</div>
        <div className="preview-content">{article.content.split(".", 1)[0].concat("...")}</div>
        <div className="preview-button"><button onClick = {() => props.changeExpand(index)} > expand this article </button></div>
      </div>
      <div className="preview-img"><div className="image-container"></div></div>
    </div>
  );
  return (
    <div className="feed">{listNews}</div>
  );
  
}

function Expanded(props){
  const article = props.article
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <button onClick = {() => props.changeExpand(-1)} > return </button>
    </div>
  );
}

function FlipPage(props){ 
  const page = props.currentPage;
  const notFirstPage = !(page == 1);
  return (
      <div>
          <div>{ notFirstPage && <button onClick={() => props.changePage(page-1)}>  prev  </button>}</div>
          <p>{page}</p>
          <button onClick={() => props.changePage(page+1)}>  next  </button>
      </div> 
  );
}

function App(){
  const [page,setPage] = useState(1);  
  const [expand,setExpand] = useState(-1);
  const [content,setContent] = useState({});

  useEffect(()=>{
      axios.get('http://localhost:5000/news', {
        params: {
          strtID:page*3-3,
          endID: page*3 
        }
      }).then(response => {
        console.log("SUCCESS", response);
        setContent(response) ;
      }).catch(error => {
        console.log(error);
      })
  },[page] );

  if (expand == -1){
    return (
        <div className = "app">
            <div>{content.status === 200 ?
              <Feed news={content.data} changeExpand={setExpand} />
              :
              <h3>loading...</h3>}
            </div>
            
            <FlipPage currentPage={page} changePage={setPage} />

        </div>
    );
  }
  else{
    return (
      <div className="app">
        <Expanded article={content.data[expand]} changeExpand={setExpand} />
      </div>
    );
  }
}


//hello

export default App;
