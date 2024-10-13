import { intro_bg, ideals_bg } from '../../../assets/Assets'
import './about_us.css'

function AboutUs() {
  return (
    <div className='main_container_about'>
        <div className="greeting_container">
        <img src={intro_bg} alt="Intro Background" className="intro_bg"/>
          <div className='text_container_about'>
            <h1 className="header_text">To Love God And To Love People</h1>
            <h3 className="intro_text">Welcome To Christian Bible Church of Hagonoy</h3>
          </div>
        </div>
        <div className="short_passage_cont">
          <div className="text_cont_passage">
            <p className="passage">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio omnis quidem enim illo hic nemo possimus dolorem, porro quibusdam animi delectus officiis repudiandae! Eaque labore illum eos ullam non unde!</p>
          </div>
          <div className="image_cont_passage">
            <img src={intro_bg} alt="Intro Background" className="intro_bg_passage"/>
          </div>
        </div> 
        <div className="ideals_container">
            <div className="ideals_bg_cont">
              <img src={ideals_bg} alt="Ideals BG" className="ideals_bg" />
            </div>
            <div className="ideals_content_container">
              <div className="content_header_ideals">
                <h2 className="ideals_text">Our Ideals</h2>
              </div>
              <div className="context_ideal_cont">
                <div className="context_img_cont">
                  <img src={intro_bg} alt="additional pic" className='ideals_right_pic'/>
                </div>
                <div className="ideals_main_cont_context">
                  <div className="row_ideals">
                    <div className="ideals_context">
                        <img src="" alt="1st ideal" className='icon_holder_ideals'/>
                        <h3 className="ideals_title"></h3>
                        <p className="ideals_description"></p>
                    </div>
                    <div className="ideals_context">
                        <img src="" alt="2nd ideal" className='icon_holder_ideals'/>
                        <h3 className="ideals_title"></h3>
                        <p className="ideals_description"></p>
                    </div>
                  </div>
                  <div className="row_ideals">
                    <div className="ideals_context">
                        <img src="" alt="3rd ideal" className='icon_holder_ideals'/>
                        <h3 className="ideals_title"></h3>
                        <p className="ideals_description"></p>
                    </div>
                    <div className="ideals_context">
                        <img src="" alt="4th ideal" className='icon_holder_ideals'/>
                        <h3 className="ideals_title"></h3>
                        <p className="ideals_description"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default AboutUs