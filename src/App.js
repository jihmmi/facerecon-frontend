import React , { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';

import './App.css';


const particleOptions = {
  particles : {
    number : {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  };

const initialState = {
  input : '',
  imageUrl : '',
  box: {},
  route: 'SignIn',
  isSignedIn : false,
  user: {
    id:'',
    name: '',
    email: '',
    entries: 0,
    joined: '', 
  }
}

class App extends Component {
constructor(){
  super();
  this.state = initialState; 
}

  loadUser = (data) => {
    this.setState({user :{
      id:data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined, 
    }})
  }

  onInputChange = (event) =>{
    this.setState({ input : event.target.value});
    // console.log('event.target.value ' + event.target.value);
    // console.log('this.state.imageUrl TEXT CHANGE' + this.state.imageUrl);
  }

  calculateFaceLocation = (data) => {
    // console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);
    return {
      leftCol : clarifaiFace.left_col * width,
      rightCol : width - (clarifaiFace.right_col * width),
      topRow : clarifaiFace.top_row * height,
      bottomRow : height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox  = (box) => {
    // console.log(box);
    this.setState({box : box});
  }

  onButtonSubmit = () => {
    // console.log('click');
    // console.log('this.state.input onButtonSubmit:' + this.state.input);
    this.setState({ imageUrl : this.state.input });
    // console.log('this.state.imageUrl onButtonSubmit:' + this.state.imageUrl);
    fetch('http://localhost:3000/imageurl',{
      method:'post',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify({
          input: this.state.input
      })
    }).then(response => response.json())
    .then(response => {
        // console.log(response.outputs[0].data.regions);
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        if(response){
          fetch('http://localhost:3000/image',{
              method:'put',
              headers: {'Content-Type':'application/json'},
              body:JSON.stringify({
                  id: this.state.user.id
              })
            }).then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user,{entries:count}))
            })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      }).catch(err => console.log(err));
  }

  onRouteChange = (route) =>
  {
    console.log("SingOut route " + route,"isSignedIn " + this.state.isSignedIn);
    if(route === 'SingOut'){
      this.setState(initialState);
    }
    else if(route === 'home')
    {
      this.setState({isSignedIn: true});
    }
    else {
      this.setState(initialState);
    }
    console.log("end SingOut route " + route,"isSignedIn " + this.state.isSignedIn);
    this.setState({route : route});

  }

  render() {
    const {isSignedIn, imageUrl, route, box, user} = this.state;
    const {name , entries} = user;
    console.log('render 3.1: input ' + this.state.input);
    console.log('render 3.2: image URL ' + imageUrl);
    console.log('render 3.3: isSignedIn  ' + isSignedIn);
    console.log('render 3.4: route  ' + route);
    console.log('render 3.5: user  ' + user);
    return(
      <div className="App">
        <Particles className='particles' params ={particleOptions} />
        <Navigation isSingedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {
          route === 'home' ?
          <div>
          <Logo/>
          <Rank name={name} entries={entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>        
          <FaceRecognition box= {box} imageUrl={imageUrl}/>
        </div>
          
          :
          (
            
            (route === 'SignIn' || route === 'SingOut') ?
              <SignIn loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
          )

        }
      </div>
  );

  }

  /*componentDidMount(){
    console.log('conponentDidMount 4.1: input ' + this.state.input);
    console.log('conponentDidMount 4.2: image URL ' + this.state.imageUrl);
    fetch('http://localhost:3000').then(response => response.json()).then(console.log);

  }*/

  // componentDidUpdate(){
  //   console.log('componentDidUpdate 5.1: input ' + this.state.input);
  //   console.log('componentDidUpdate 5.2: image URL ' + this.state.imageUrl);
  // }

  // componentDidCatch(){
  //   console.log('componentDidCatch 6.1: input ' + this.state.input);
  //   console.log('componentDidCatch 6.2: image URL ' + this.state.imageUrl);
  // }


}

export default App;
