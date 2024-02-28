import './Home.css';
import copyImage from '../assets/copyIcon.png';
import saveImage from '../assets/save.png';
import handsImage from '../assets/hands.png';
import clockImage from '../assets/clock.png';
import Contact from './Contact.tsx';

export default function Home() {
  return (
    <div id='outside'>
      <div id='home'></div>
      <h1 className='bigText'>Welcome to dashQL</h1>
      <div id='pWrapper'>
        <p className='smallText'>
          A dashing and dynamic caching tool for GraphQL.
        </p>
      </div>
      <div id='codeWrapper'>
        <div id='box'>
          <pre>$ npm install dashQL</pre>
        </div>
        <button
          id='copyButton'
          onClick={() => {
            navigator.clipboard.writeText('npm install dashQL');
          }}
        >
          <img id='copy' src={copyImage}></img>
        </button>
      </div>
      <hr className='grayLine'></hr>
      <div id='whatIsWrap'>
        <h1 id='lowerBigText'>What is dashQL?</h1>
        <p id='whatIsText' className='randomText'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu.
        </p>
      </div>
      <div id='horizBar'>
        <div className='vertColumn'>
          <img className='bottomImg' src={saveImage}></img>
          <h1 className='lowerNormText'>Cache Responses</h1>
          <p className='randomText'>Efficiently store and retrieve data</p>
        </div>
        <div className='vertLine'></div>
        <div className='vertColumn'>
          <img className='bottomImg' src={handsImage}></img>
          <h1 className='lowerNormText'>Optimize Efficiency</h1>
          <p className='randomText'>Reduce redundant network requests</p>
        </div>
        <div className='vertLine'></div>
        <div className='vertColumn'>
          <img className='bottomImg' src={clockImage}></img>
          <h1 className='lowerNormText'>Quicker Fetches</h1>
          <p className='randomText'>Improve query response performance</p>
        </div>
      </div>
      <div className='demoSect'>
        <h1>Ready to see how it works?</h1>
        <a href='/demo'>
          <button id='demoButton'>Try Demo</button>
        </a>
      </div>
      <div id='contactBar'>
        <hr className='grayLine'></hr>
        <h1>Meet the Team</h1>
        <div id='contactContain'>
          <Contact
            name={'Dan Bonney'}
            github={'https://github.com/D-Bonney'}
            linkedin={'https://www.linkedin.com/in/dan-bonney/'}
          />
          <Contact
            name={'Drew Williams'}
            github={'https://github.com/avwilliams1995'}
            linkedin={'https://www.linkedin.com/in/andrew-vaughan-williams/'}
          />
          <Contact
            name={'Kevin Klochan'}
            github={'https://github.com/kevinklochan'}
            linkedin={'https://www.linkedin.com/in/kevin-klochan-7a0ba7218/'}
          />
          <Contact
            name={'Meredith Fronheiser'}
            github={'https://github.com/mfronheiser'}
            linkedin={'https://www.linkedin.com/in/meredith-fronheiser/'}
          />
        </div>
      </div>
    </div>
  );
}