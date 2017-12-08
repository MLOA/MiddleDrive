import riot from 'riot'
import api from './api'
import app from '../tag/app'

api.getDeviceName().then(res => {
	riot.mount('main', 'app', {
		deviceName: res
	})
})