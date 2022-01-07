
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios' ;
import qs from 'qs'

function Feed(props){
  const news = props.news;
  
  const [bias, setBias] = useState(Array(news.length).fill(3));

  useEffect(()=>{
    //setBias(Array(news.length).fill(3));
    const queryID = [];
      for (let i=0; i<news.length; i++) {
        queryID.push(news[i].ID);
      }
    axios.get('http://localhost:5000/bias', {
      params: {
        query: queryID
      },
      paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
    }).then(response => {
      console.log("SUCCESS", response);
      setBias(response.data) ;
    }).catch(error => {
      console.log(error);
    });
  },[] );
  const styles = [
    {backgroundColor: 'red'},
    {backgroundColor: 'green'},
    {backgroundColor: 'blue'},
    {backgroundColor: 'grey'},
  ];
  console.log(bias);
  const listNews = news.map((article,index) =>
    <button className="preview" style={styles[bias[index]]} onClick = {() => props.changeExpand((oldArray) => oldArray.concat(article))} key={article.title}>
      <div className="preview-text">
        <div className="preview-source">{article.source}</div>
        <div className="preview-title">{article.title}</div>
        <div className="preview-content">{article.content.split(".", 1)[0].concat("...")}</div>
        <div className="preview-date">{article.date}</div>
      </div>
      <div className="preview-img"><div className="image-container"></div></div>
    </button>
  );
  return (
    <div className="feed">{listNews}</div>
  );
  
}

function Recommendation(props){
  const [recommend,setRecommend] = useState({});
  useEffect(()=>{
    setRecommend({});
    axios.get('http://localhost:5000/recommend', {
      params: {
        originalID: props.ID
      }
    }).then(response => {
      console.log("SUCCESS", response);
      setRecommend(response) ;
    }).catch(error => {
      console.log(error);
    });
  },[props.ID] );
  if (recommend.status === 200) {
    return (
      <Feed news={recommend.data} changeExpand={props.changeExpand} />
    )
  }else{
    return (
      <h3>loading...</h3>
    )
  }
}

function Expanded(props){
  const article = props.article
  return (
    <div className = "expand" >
      <div className="expand-head">
        <h1 className='expand-title'>{article.title}</h1>
        <div>{article.source}</div>
        <div>{article.date}</div>
      </div>
      <p>{article.content}</p>
      <button className='button' onClick = {() => props.changeExpand(oldArray => oldArray.slice(0, -1))} > return </button>
      <Recommendation ID={article.ID} changeExpand={props.changeExpand} />
    </div>
  );
}

function FlipPage(props){ 
  const page = props.currentPage;
  const notFirstPage = !(page === 1);
  return (
      <div className = "navi">
          { notFirstPage && <button className='button' onClick={() => props.changePage(page-1)}>  prev  </button>}
          <p className='navi-pagenum'>{page}</p>
          <button className='button' onClick={() => props.changePage(page+1)}>  next  </button>
      </div> 
  );
}

function App(){
  const [page,setPage] = useState(1);  
  const [expand,setExpand] = useState(-1);
  const [content,setContent] = useState({});    
  const [expContent,setExpContent] = useState([]);    //array that stores the content of expanded articles, each elements need to have one more attribute, the ID of it

  useEffect(()=>{
      axios.get('http://localhost:5000/page', {
        params: {
          page:page
        }
      }).then(response => {
        console.log("SUCCESS", response);
        setContent(response) ;
      }).catch(error => {
        console.log(error);
      });
      setContent({});

  },[page] );

  if (expContent.length === 0){
    return (
        <div className = "app">
            <div>{content.status === 200 ?
              <Feed news={content.data} changeExpand={setExpContent} />
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
        <Expanded article={expContent[expContent.length-1]} changeExpand={setExpContent} />
      </div>
    );
  }
}


export default App;
