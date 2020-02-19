import React, { Component } from 'react'
import { WebView } from 'react-native-webview'
import PropTypes from 'prop-types'

export default class Repository extends Component {
  render() {
    const { navigation } = this.props
    const { html_url } = navigation.getParam('repository')

    return <WebView source={{ uri: html_url }} />
  }
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
})
