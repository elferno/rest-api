import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'
import request from './request.js'

Vue.component('loader', {
	props: ['center'],
	template: `
		<div :style="center
			? 'display: flex; justify-content: center; align-items: center;'
			: 'position: absolute; margin-top: -35px; margin-left: 100px;'
		">
			<div class="spinner-border" role="status">
				<span class="sr-only"></span>
			</div>
		</div>
	`
})

new Vue({
	el: '#app',
	data() {
		return {
			API: {
				contacts: '/api/contacts'
			},
			isLoading: false,
			isCreating: false,
			isMarking: false,
			isDeleting: false,
			form: {
				name: '',
				value: ''
			},
			contacts: []
		}
	},
	computed: {
		canCreate() {
			return this.form.name.trim() && this.form.value.trim() && !this.isCreating
		}
	},
	methods: {
		async createContact() {
			const contact = {...this.form}
			this.isCreating = true
			this.contacts.push(await request(this.API.contacts, 'POST', contact))
			this.form.name = this.form.value = ''
			this.isCreating = false
		},
		async markContact(id) {
			this.isMarking = true
			const contact = this.contacts.find(c => c.id === id)
			const updated = await request(`${this.API.contacts}/${id}`, 'PUT', {
				...contact,
				marked: !contact.marked
			})
			contact.marked = updated.marked
			this.isMarking = false
		},
		async removeContact(id) {
			this.isDeleting = true
			await request(`${this.API.contacts}/${id}`, 'DELETE')
			this.contacts = this.contacts.filter(c => c.id !== id)
			this.isDeleting = false
		}
	},
	async mounted() {
		this.isLoading = true
		this.contacts = await request(this.API.contacts)
		this.isLoading = false
	}
})