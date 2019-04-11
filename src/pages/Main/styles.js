import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7159C1',
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#DDD',
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 16,
    height: 48,
    marginTop: 30,
    paddingHorizontal: 20,
  },
  logo: {
    alignSelf: 'center'
  }
});

export default styles;