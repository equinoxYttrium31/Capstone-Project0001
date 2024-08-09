import React, { useState } from 'react';
import './Announcement_Management.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Announcement_Management() {
  const [value, setValue] = useState('');

  const handleChange = (content) => {
    setValue(content);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'script',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
    'background',
    'indent',
    'direction'
  ];

  return (
    <div className='announcement_main_container'>
      <div className="announcement_header">
        <p className="church_name_announcement">CHRISTIAN BIBLE CHURCH OF HAGONOY</p>
        <h2 className="page_title_announcement">Announcement Management</h2>
      </div>
      <div className="create_announcement_title_cont">
        <h3 className="create_announcement_title">Create an announcement</h3>
      </div>
      <div className="add_title_cont">
        <label htmlFor="add_title" className="add_title_text">Announcement Title :</label>
        <input type="text" name="add_title" id="add_title" className="add_title" required />
      </div>
      <div className="rich_text_input_container">
        <label htmlFor="announcement_content" className="announcement_content_label">Message :</label>
        <ReactQuill
          className='announcement_content'
          id='announcement_content'
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          theme="snow"
          required
        />
      </div>
      <div className="audience_content_container">
        <label htmlFor="" className="audience_label">Audience :</label>
        <div class="radio-buttons">
            <label class="radio-square">
                <input type="radio" name="option" value="1" required/>
                <span class="checkmark"></span>
                All Cellgroups
            </label>
            <label class="radio-square">
                <input type="radio" name="option" value="2" required/>
                <span class="checkmark"></span>
                Network Leaders
            </label>
        </div>
      </div>
      <div className="date_publish_container">
            <label htmlFor="" className="date_publish_label">Date to publish :</label>
            <div className="input_container_date">
                <input type="date" name="intial_date" id="" className='publishing_date' required/>
                <p className="to_label"> to </p>
                <input type="date" name="up-to_date" id="" className='publishing_date' required/>
            </div>
      </div>
      <div className="button_container_announcement">
        <button className="announcement_draft">Draft</button>
        <button className="announcement_post">Post</button>
      </div>
    </div>
  );
}

export default Announcement_Management;
