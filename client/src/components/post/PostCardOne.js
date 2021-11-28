import React from "react";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const PostCardOne = ({ posts }) => {
  return (
    <>
      {Array.isArray(posts)
        ? posts.map(({ _id, title, fileUrl, comments, views }) => {
            return (
              <div key={_id} className="col-md-4" id="postCard">
                <Link
                  to={`/post/${_id}`}
                  className="text-dark text-decoration-none"
                >
                  <Card className="mb-6">
                    <CardImg top alt="카드이미지" src={fileUrl} />
                    <CardBody className="card-style">
                      <CardTitle className="text-truncate d-flex justify-content-between pb-2">
                        <span className="text-truncate">{title} </span>
                        <span>
                          <FontAwesomeIcon icon={faEye} />
                          &nbsp;&nbsp;
                          <span>{views}</span>
                        </span>
                      </CardTitle>
                      <Row>
                        <Button className="p-2 btn-color ">
                          자세히 <Badge color="light">{comments.length}</Badge>
                        </Button>
                      </Row>
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })
        : ""}
    </>
  );
};

export default PostCardOne;
