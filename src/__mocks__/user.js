const user = {
	email: 'test@email.com'
}

export default {
	email: jest.fn().mockResolvedValue(user)
}
