import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles'
import api from '../../services/api'

export default class User extends Component {
  constructor() {
    super()
    this.state = {
      stars: [],
      loading: true,
      loadingMore: false,
      refreshing: false,
      page: 1,
    }
  }

  componentDidMount() {
    this.load()
  }

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.load)
  }

  loadMore = () => {
    const { page } = this.state

    const nextPage = page + 1

    this.setState({ loadingMore: true }, () => this.load(nextPage))
  }

  load = async (page = 1) => {
    const { stars } = this.state
    const { navigation } = this.props
    const user = navigation.getParam('user')

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    })

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      loading: false,
      refreshing: false,
      loadingMore: false,
    })
  }

  render() {
    const { navigation } = this.props
    const { stars, loading, loadingMore, refreshing } = this.state

    const user = navigation.getParam('user')

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator color="#7159c1" />
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}

        {loadingMore && <ActivityIndicator color="#7159c1" />}
      </Container>
    )
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
})
