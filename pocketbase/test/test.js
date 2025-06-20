import PocketBase from 'pocketbase';

// dont worry, this token is not real, its from my local dev instance
const token = `
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3NDc3NjYzNTUsImlkIjoiYjU0MTR1bWI1OTI2NTAzIiwicmVmcmVzaGFibGUiOmZhbHNlLCJ0eXBlIjoiYXV0aCJ9.Ur2r0_FNjENsIE4A3b7YVxwuD_CfiqIMKteDQFKdg0Q
`.trim();
const pb = new PocketBase('http://0.0.0.0:8080');

pb.authStore.save(token, null);

try {
	const invite = 'jixa99io2qq7e33';
	const userid = 'b5414umb5926503';

	pb.collection('teamInvitations').update(invite, {
		'joined+': [userid]
	});
} catch (error) {
	console.log('Error:', error);
}
