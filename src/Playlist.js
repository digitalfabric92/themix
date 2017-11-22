import React, { Component } from 'react';
import './Playlist.css';
import './features.js';
import axios from 'axios';
import queryString from 'query-string';
class Playlist extends Component {
  constructor(props){
    super(props);
    this.state = {
      accessToken: queryString.parse(this.props.location.search),
      playlists: [],
      tracks: []
    }
  }

  componentDidMount(){

  // Getting the users playlists
    const accessToken = this.state.accessToken.access_token;
    const options = {headers: {'Authorization': 'Bearer ' + accessToken}, json: true}
    axios.get(`https://api.spotify.com/v1/users/digital-fabric/playlists`, options)
      .then((res)=>{
        console.log(res.data.items);
        this.setState({playlists: res.data.items})
      })
  }

  // Request for the playlists tracks and post to the mix playlist
  getTracks = (playlistID) => {
    const accessToken = this.state.accessToken.access_token;
    const token_type = 'Bearer';
    const options = {headers: {'Authorization': 'Bearer ' + accessToken}, json: true}
    axios.get(`https://api.spotify.com/v1/users/digital-fabric/playlists/${playlistID}/tracks`, options)
    .then((res) => {
      console.log(res.data.items);
      this.setState({tracks: res.data.items})
      this.state.tracks.forEach((track) => {
       let uri = track.track.uri;
       let postUrl = `https://api.spotify.com/v1/users/digital-fabric/playlists/2M3kZY1t1vocCub719j2qR/tracks?uris=${uri}`
       axios({
         method: 'post',
         url: postUrl,
         headers: { 'Authorization': `${token_type} ${accessToken}`,'Accept': 'application/json'}
       })
       .then((res) => {
        console.log('posted to playlist')
       })
       .catch((err) => {
        console.log(err.response.data)
       })
     })
    })
    .then((res) => {
      this.props.history.push('/space')
    })
  }

  render() {
    // This if handles the empty array of playlists at first
    let { playlists = undefined } = this.state;
      if(playlists){
    return (
    <div className='overall'>
      <h1 className="head">Choose your Playlist</h1>
      { playlists.map( (playlist, index) => {
      return(
        <div id="card" key={index}>
          <h1>{playlist.name}</h1>
          <h3>{playlist.tracks.total} Tracks</h3>
          <button onClick={(evt) => this.getTracks(playlist.id)}>Add to Mix</button>
        </div>
      )})}
    </div>
    )} else {
      return (
        <h1>Loading.....</h1>
      )}
  }
};

export default Playlist;
