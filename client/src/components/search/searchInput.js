import React, { useState, useRef, Fragment } from "react";
import { Form, Input } from "reactstrap";
import { useDispatch } from "react-redux";
import { SEARCH_REQUEST } from "../../redux/types";

const SearchInput = () => {
  const dispatch = useDispatch();
  const [form, setValues] = useState({ searchBy: "" });

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const onSubmit = async (e) => {
    await e.preventDefault();
    const { searchBy } = form;

    dispatch({
      type: SEARCH_REQUEST,
      payload: searchBy,
    });

    resetValue.current.value = "";
  };
  const resetValue = useRef(null);

  return (
    <>
      <Form onSubmit={onSubmit} className="col mt-2">
        <Input id="search" name="searchBy" onChange={onChange} innerRef={resetValue} placeholder="검색어를 입력해주세요"/>
      </Form>
    </>
  );
};

export default SearchInput;