import "./Beliefs.css";
import { useScrollAnimation } from "../About Us/useScrollAnimation";
import ContactUs from "../../footer/Contact_Us";

import {
  baptism_image,
  beliefs_header,
  bible,
  communion_image,
  FAQs_ic,
  god,
  holy_spirit,
  jesus_christ,
  salvation_header,
} from "../../../assets/Church_Images/church_images";

function Beliefs() {
  const [isVisiblePage, pageRef] = useScrollAnimation(0.01);
  const [isVisibleBeliefs, beliefsRef] = useScrollAnimation(0.3);
  const [isVisibleHeader, headerRef] = useScrollAnimation(1);

  return (
    <div className="beliefs_page_container" ref={pageRef}>
      {/**Header Image */}
      <div className="header_image_container">
        <img
          src={beliefs_header}
          alt="Header_Image"
          className={`beliefs_header_image ${isVisiblePage ? "drop-down" : ""}`}
          ref={headerRef}
        />
      </div>

      {/*Core Doctrinal*/}
      <div className="coreDoctrinal_container">
        <div className="header_coreDoctrinal">
          <h1
            className={`header_Title ${isVisibleHeader ? "slide-right" : ""}`}
          >
            Our Core Beliefs
          </h1>
          <p
            className={`header_additional_text ${
              isVisibleHeader ? "slide-right" : ""
            }`}
          >
            At Christian Bible Church of Hagonoy, we hold to these foundational
            beliefs:
          </p>
        </div>
        <div className="main_beliefs_container" ref={beliefsRef}>
          <div
            className={`beliefs_container_each ${
              isVisibleBeliefs ? "slide-right" : ""
            }`}
          >
            <img
              src={god}
              alt="illustration"
              className="beliefs_illustrations"
            />
            <div className="beliefs_texts_container">
              <h2 className="beliefs_title">God</h2>
              <p className="beliefs_details">
                We believe in one God, eternally existent in three persons:
                Father, Son, and Holy Spirit.
              </p>
            </div>
          </div>
          <div
            className={`beliefs_container_each ${
              isVisibleBeliefs ? "slide-right" : ""
            }`}
          >
            <img
              src={jesus_christ}
              alt="illustration"
              className="beliefs_illustrations"
            />
            <div className="beliefs_texts_container">
              <h2 className="beliefs_title">Jesus Christ</h2>
              <p className="beliefs_details">
                We affirm the deity of Jesus Christ, His virgin birth, sinless
                life, miracles, atoning death on the cross, bodily resurrection,
                ascension to the right hand of the Father, and His personal
                return in power and glory.
              </p>
            </div>
          </div>
          <div
            className={`beliefs_container_each ${
              isVisibleBeliefs ? "slide-right" : ""
            }`}
          >
            <img
              src={holy_spirit}
              alt="illustration"
              className="beliefs_illustrations"
            />
            <div className="beliefs_texts_container">
              <h2 className="beliefs_title">The Holy Spirit</h2>
              <p className="beliefs_details">
                We believe in the present ministry of the Holy Spirit, who
                convicts, regenerates, indwells, and empowers believers for
                godly living and service.
              </p>
            </div>
          </div>
          <div
            className={`beliefs_container_each ${
              isVisibleBeliefs ? "slide-right" : ""
            }`}
          >
            <img
              src={bible}
              alt="illustration"
              className="beliefs_illustrations"
            />
            <div className="beliefs_texts_container">
              <h2 className="beliefs_title">The Bible</h2>
              <p className="beliefs_details">
                We hold the Bible as the inspired, infallible, and authoritative
                Word of God, sufficient for faith and practice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*Statement of Faith*/}
      <div className="StatementofFaith_container">
        <div className="StatementofFaith_header_container">
          <h1 className="statement_header_title">Our Statement of Faith</h1>
          <p className="statement_header_context">
            At Christian Bible Church of Hagonoy, our beliefs are deeply rooted
            in the teachings of Scripture and are aligned with the Baptist Faith
            and Message 2000, a confessional document that expresses the core
            theological convictions held by Baptist churches worldwide. This
            alignment reflects our commitment to biblical authority, the
            importance of the local church, and the believer’s responsibility in
            living out their faith.
          </p>
        </div>
        <div className="summary_container_beleifs">
          <details>
            <summary className="title_summary">
              By affirming the Baptist Faith and Message 2000, we declare our
              adherence to essential Christian doctrines, including:
            </summary>
            <ul className="summary_list">
              <li>
                <b>The Trinity:</b> Belief in one God who exists eternally in
                three persons—Father, Son, and Holy Spirit.
              </li>
              <li>
                <b>Salvation by Grace through Faith:</b> Salvation is a gift
                from God, received through faith in Jesus Christ, not by human
                efforts.
              </li>
              <li>
                <b>Baptism and the Lord&apos;s Supper:</b> We practice
                believer&apos;s baptism by immersion and regularly observe the
                Lord&apos;s Supper as acts of obedience and symbols of our
                faith.
              </li>
              <li>
                <b>The Church:</b> The local church is an autonomous body of
                baptized believers who gather for worship, discipleship,
                fellowship, and mission.
              </li>
            </ul>
          </details>
        </div>
      </div>

      {/*Salvation*/}
      <div className="Salvation_cont">
        <div className="Salvation_header_container">
          <img
            src={salvation_header}
            alt="salvation_header"
            className="salvation_header_image"
          />
          <h1 className="salvation_title">Salvation</h1>
          <p className="salvation_intro">
            At Christian Bible Church of Hagonoy, we believe that salvation is a
            gift of God&apos;s grace, received through faith in Jesus Christ
            alone.
          </p>
        </div>
        <div className="salvation_details">
          <h2 className="salvation_questions">What is Salvation?</h2>
          <p className="salvation_answers">
            Salvation is God&apos;s free gift to humanity, offered through the
            life, death, and resurrection of Jesus Christ. It is the deliverance
            from sin and its consequences, including eternal separation from
            God.
          </p>
          <h2 className="salvation_questions">How Can We Be Saved?</h2>
          <p className="salvation_answers">
            We are saved by grace through faith in Jesus Christ (Ephesians
            2:8-9). This means acknowledging our sinfulness, believing in
            Jesus&apos; sacrifice on the cross, and trusting in Him for the
            forgiveness of sins and eternal life.
          </p>
          <h2 className="salvation_questions">The Role of Repentance</h2>
          <p className="salvation_answers">
            Repentance is an essential aspect of salvation. It involves turning
            away from sin and turning to God in faith, seeking His forgiveness
            and committing to a life of obedience to Him (Acts 3:19).
          </p>
          <h2 className="salvation_questions">Assurance of Salvation</h2>
          <p className="salvation_answers">
            As believers, we can have assurance of our salvation through the
            indwelling Holy Spirit who seals us for the day of redemption
            (Ephesians 1:13-14). This assurance is based on God&apos;s
            faithfulness and the promises in His Word.
          </p>
        </div>
      </div>

      {/*Baptism*/}
      <div className="Baptism_cont">
        <div className="baptism_header_container">
          <h1 className="baptism_title">Baptism & Communion</h1>
          <p className="baptism_intro">
            At Christian Bible Church of Hagonoy, we believe in baptism by
            immersion, symbolizing the believer&apos;s identification with the
            death, burial, and resurrection of Jesus Christ.
          </p>
        </div>
        <div className="baptism_page_container">
          {/* Baptism Card */}
          <div className="glass-card">
            <img src={baptism_image} alt="Baptism" className="card-image" />
            <div className="card-overlay">
              <h2 className="card-title">Baptism</h2>
              <p className="card-description">
                We practice believer&apos;s baptism by immersion as a public
                declaration of faith in Jesus Christ.
              </p>
            </div>
          </div>

          {/* Communion Card */}
          <div className="glass-card">
            <img src={communion_image} alt="Communion" className="card-image" />
            <div className="card-overlay">
              <h2 className="card-title">Communion</h2>
              <p className="card-description">
                We observe the Lord&apos;s Supper regularly, remembering
                Christ&apos;s sacrifice and anticipating His return.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*FAQs*/}
      <div className="FAQs_cont">
        <div className="FAQs_header_container">
          <img src={FAQs_ic} alt="questionMark" className="FAQs_header_image" />
          <h1 className="FAQs_header_text">Frequently Asked Question</h1>
        </div>
        <div className="main_questions_container">
          <details className="question_and_answer">
            <summary className="questions_text">
              What is the mission of Christian Bible Church of Hagonoy?
            </summary>
            <p className="answer_text">
              Our mission is to glorify God by sharing the gospel, nurturing
              discipleship, and serving our community with love and compassion.
              We aim to spread hope and redemption through Christ while creating
              a welcoming environment for all.
            </p>
          </details>

          <details className="question_and_answer">
            <summary className="questions_text">
              What are your beliefs about baptism?
            </summary>
            <p className="answer_text">
              We practice believer&apos;s baptism, which means that we baptize
              individuals who have made a personal confession of faith in Jesus
              Christ. Baptism is an outward expression of the inward
              transformation that has taken place through faith.
            </p>
          </details>

          <details className="question_and_answer">
            <summary className="questions_text">
              How does the church engage with social justice issues?
            </summary>
            <p className="answer_text">
              We believe that God calls us to serve others and seek justice. We
              address social issues through compassion ministries, community
              outreach programs, and missions work. We strive to be the hands
              and feet of Christ in bringing justice, mercy, and healing to our
              community.
            </p>
          </details>

          <details className="question_and_answer">
            <summary className="questions_text">
              What does the church teach about salvation?
            </summary>
            <p className="answer_text">
              We believe that salvation is a gift from God, given by grace
              through faith in Jesus Christ. It is not earned through works but
              received by believing in Christ’s sacrificial death and
              resurrection, which provides forgiveness for sins and eternal
              life.
            </p>
          </details>

          <details className="question_and_answer">
            <summary className="questions_text">
              How can I get involved in the church&apos;s outreach programs?
            </summary>
            <p className="answer_text">
              We have various outreach opportunities, from local community
              service projects to global missions. You can get involved by
              joining our service teams, volunteering for events, or
              participating in one of our ongoing ministries. Feel free to
              contact us or visit during a service to learn more.
            </p>
          </details>

          <details className="question_and_answer">
            <summary className="questions_text">
              What are the core values of Christian Bible Church of Hagonoy?
            </summary>
            <p className="answer_text">
              Our core values include faith in Jesus Christ, love for God and
              others, serving with humility, fostering a welcoming community,
              and living with integrity. These values guide our ministry,
              outreach, and interactions with one another.
            </p>
          </details>

          <details className="question_and_answer">
            <summary className="questions_text">
              How can I learn more about your doctrinal beliefs?
            </summary>
            <p className="answer_text">
              We encourage you to contact us directly if you have questions
              about specific doctrinal topics. You are also welcome to attend
              our services, join a Bible study group, or meet with one of our
              pastors to explore more about our beliefs.
            </p>
          </details>
        </div>
      </div>

      <ContactUs />
    </div>
  );
}

export default Beliefs;
