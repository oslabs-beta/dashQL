import './Contact.css';
import ghLogo from '../assets/github-logo.png';
import linkedinLogo from '../assets/linkedin-logo.png';

export default function Contact(props: any) {
  return (
    <div id='outerBox'>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <a href={props.github}>
          <img id='github' className='logo' src={ghLogo} />
        </a>
        <a href={props.linkedin}>
          <img id='linked' className='logo' src={linkedinLogo} />
        </a>
      </div>
      <h1 className='contactText'>{props.name}</h1>
      <img className='photo' src={props.img}></img>
    </div>
  );
}
