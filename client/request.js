const request = async (url, method = 'GET', body = null) => {
	try {
		// var
		const headers = {}
		if (body) {
			headers['Content-Type'] = 'application/json'
			body = JSON.stringify(body)
		}

		// request
		const response = await fetch(url, {
			method,
			headers,
			body
		})

		// return response
		return response.json()
	} catch (e) {
		console.warn(`request to server failed with error: ${e.message}`);
	}
}

export default request