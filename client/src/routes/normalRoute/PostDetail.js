import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { 
    POST_DETAIL_LOADING_REQUEST, 
    POST_DELETE_REQUEST, 
    USER_LOADING_REQUEST, 
} from '../../redux/types';
import { Row, Button, Container  } from 'reactstrap';
// import {Col, Row, Button} from 'react-bootstrap'; 
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Link } from 'react-router-dom';
import { GrowingSpinner } from '../../components/spinner/Spinner';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faPencilAlt,
    faCommentDots,
    faEye,
} from "@fortawesome/free-solid-svg-icons";
import BalloonEditor from "@ckeditor/ckeditor5-editor-balloon/src/ballooneditor";
import { editorConfiguration } from '../../components/editor/EditorConfig';
import Comments from "../../components/comments/Comments";



const PostDetail = (req) => {
  const dispatch = useDispatch();
  const { postDetail, creatorId, title, loading } = useSelector(
    (state) => state.post
  );
  const { userId, userName } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comment);


  useEffect(() => {
    dispatch({
      type: POST_DETAIL_LOADING_REQUEST,
      payload: req.match.params.id,
    });
    dispatch({
      type: USER_LOADING_REQUEST,
      payload: localStorage.getItem("token"),
    });
  }, [dispatch, req.match.params.id]);

  const onDeleteClick = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      dispatch({
        type: POST_DELETE_REQUEST,
        payload: {
          id: req.match.params.id,
          token: localStorage.getItem("token"),
        },
      });
      alert("삭제되었습니다.");
    } else {

    }
  };



  const EditButton = (
    <>
      <div className="d-flex justify-content-end pb-3"> 
          <div className="col-md3 ">
          <Link
            to={`/post/${req.match.params.id}/edit`}
            className="btn btn-detail btn-block">
            수정
          </Link>
        </div>
        <div className="col-md3">
          <Button id="delete" className="btn-detail btn-block"  onClick={onDeleteClick}>
            삭제
          </Button>
        </div>
      </div>
    </>
  );




  const Body = (
    <>
      {userId === creatorId ? EditButton : ""}
      <Row className="border-bottom border-top p-3 mb-3 d-flex justify-content-between">
        {(() => {
          if (postDetail && postDetail.creator) {
            return (
              <>
                <div className="font-weight-bold text-big">
                  <span className="mr-3">
                    <Button className="tag">
                      {postDetail.category.categoryName}
                    </Button>
                    <br/><br/><br/>
                  </span>
                  <div id="postTitle"> {postDetail.title}</div>
                </div>
                <div id="creator">작성자 : {postDetail.creator.name}</div>
              </>
            );
          }
        })()}
      </Row>
      {postDetail && postDetail.comments ? (
        <>
          <div className="d-flex justify-content-end align-items-baseline small">
            <FontAwesomeIcon icon={faPencilAlt} />
            &nbsp;
            <span> {postDetail.date}</span>
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faCommentDots} />
            &nbsp;
            <span>{postDetail.comments.length}</span>
            &nbsp;&nbsp;
            <FontAwesomeIcon icon={faEye} />
            <span>{postDetail.views}</span>
          </div>
          <Row className="mb-3">
            <CKEditor
              editor={BalloonEditor}
              data={postDetail.contents}
              config={editorConfiguration}
              disabled="true"
            />
          </Row>
          <Row>
            <Container className="mb-3 border border-blue rounded">
              {Array.isArray(comments)
                ? comments.map(
                    ({ contents, creator, date, _id, creatorName }) => (
                      <div key={_id}>
                        <Row className="justify-content-between p-2">
                          <div className="font-weight-bold">
                            {creatorName ? creatorName : creator}
                          </div>
                          <div className="text-small">
                            <span className="font-weight-bold">
                              {date.split(" ")[0]}
                            </span>
                            <span className="font-weight-light">
                              {" "}
                              {date.split(" ")[1]}
                            </span>
                          </div>
                        </Row>
                        <Row className="p-2">
                          <div>{contents}</div>
                        </Row>
                        <hr />
                      </div>
                    )
                  )
                : "Creator"}
              <Comments
                id={req.match.params.id}
                userId={userId}
                userName={userName}
              />
            </Container>
          </Row>
        </>
      ) : (
        <h1>hi</h1>
      )}
    </>
  );


  return (
    <div>
      <Helmet title={`Post | ${title}`} />
      {loading === true ? GrowingSpinner : Body}
    </div>
  );
};

export default PostDetail;
