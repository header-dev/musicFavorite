import React from "react";
import { ScrollView, StyleSheet, Text, ActivityIndicator,View,Alert } from "react-native";
import { Card, Button,Icon } from 'react-native-elements';
import { CardList } from '../components/CardList';
import {  SearchText } from '../components/SearchText';
import * as actions from '../actions';

export default class AlbumsScreen extends React.Component {
  static navigationOptions = {
    title: "Albums"
  };

  constructor() {
      super();

      this.state = {
        albums: [],
        isFetching:false
      }

      this.searchTracks = this.searchTracks.bind(this);
      this.renderButtonNavigation = this.renderButtonNavigation.bind(this);
  }

  searchTracks(artist){
    this.setState({isFetching: true, albums:[], artist});
    actions.searchTracks(artist)
    .then(albums => this.setState({ albums,isFetching:false }))
    .catch(error => this.setState({ albums: [] ,isFetching:false }));
  }

  async saveAlbumToFavorite(album){
    const favoriteAlbums = await actions.retrieveData('favoriteAlbums') || {};

    if (favoriteAlbums[album.id]) {
      Alert.alert(
        'Cannot add Album',
        'Album is already in Favorites!',
        [{ text: "Continue", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return false;
    }

    favoriteAlbums[album.id] = album;

    const success = await actions.storeData('favoriteAlbums',favoriteAlbums);

    if (success) {
      Alert.alert(
        "Album Added!",
        `Track ${album.title} from ${this.state.artist} was added to favorites!`,
        [{ text: "Continue", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }

  }

  renderButtonNavigation(album){
    const {artist} = this.state;


    return (
      <View style={styles.buttonNavigation}>
        <Icon onPress={() => {}} 
          raised
          name="play"
          type="font-awesome"
          color="#f50"
          size={30}/>
        <Icon onPress={() => { this.props.navigation.navigate('AlbumDetail', {album,artist}) }}
          raised
          name="info"
          type="font-awesome"
          color="#f50"
          size={30} />
        <Icon onPress={() => this.saveAlbumToFavorite(album)}
          raised
          name="thumbs-up"
          type="font-awesome"
          color="#f50"
          size={30} />
      </View>
    );
  }

  renderAlbumView(){
    const { albums,isFetching } = this.state;

    return(
      <ScrollView style={styles.container}>
        <SearchText submitSearch={this.searchTracks}></SearchText>
        { albums.length > 0 && !isFetching && 
        <CardList data={albums}
          imageKey={'cover_big'}
          titleKey={'title'}
          buttonText="See the detail"
          buttonView={this.renderButtonNavigation}></CardList>
        }{albums.length === 0 && isFetching &&
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        }
        
      </ScrollView>
    );
  }

  render() {
    return this.renderAlbumView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  buttonNavigation:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
