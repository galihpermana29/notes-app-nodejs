const { nanoid } = require('nanoid');
const notes = require('./notes');

//ADD NOTES
const addNoteHandler = (request, h) => {
	// mengambil data JSON pada body request
	const { title, tags, body } = request.payload;

	// generate id
	const id = nanoid(16);

	//generate time
	const createdAt = new Date().toISOString();
	const updatedAt = createdAt;

	//setelah data diambil dari kiriman user, kita masukkan ke object dengan susunan ini
	const newNote = {
		title,
		tags,
		body,
		id,
		createdAt,
		updatedAt,
	};

	//push ke array notes pada notes.js
	notes.push(newNote);
	const isSuccess = notes.filter((note) => note.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: 'success',
			message: 'Catatan berhasil ditambahkan',
			data: {
				noteId: id,
			},
		});
		response.code(201);
		return response;
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Catatan gagal ditambahkan',
		});
		response.code(500);
		return response;
	}
};

//GET ALL NOTES
const getAllNotesHandler = (request, h) => ({
	status: 'success',
	data: {
		notes,
	},
});

//GET BY ID NOTES
const getNoteByIdHandler = (request, h) => {
	// dapatkan parameter id dari url yg dikirim front
	const { id } = request.params;

	//filtering id yg cocok di array notes
	const note = notes.filter((n) => n.id === id)[0];

	// jika tidak undefined atau hasil cari notes itu ada dalam array
	if (note !== undefined) {
		return {
			status: 'success',
			data: {
				note,
			},
		};
		// jika undef, return failed
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Catatan tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

//EDIT NOTES
const editNoteByIdHandler = (request, h) => {
	//ketika ngedit postingann, idnya kita ambil dulu
	const { id } = request.params;

	// ambil body
	const { title, tags, body } = request.payload;

	//update berubah
	const updatedAt = new Date().toISOString();

	//dapatkan index dari data yang ingin di ubah pada array notes
	const index = notes.findIndex((note) => note.id === id);

	//jika ada index, assign ke array
	if (index !== -1) {
		notes[index] = {
			...notes[index],
			title,
			tags,
			body,
			updatedAt,
		};
		const response = h.response({
			status: 'success',
			message: 'Catatan berhasil diperbarui',
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Gagal memperbarui catatan. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

//DELETE NOTES
const deleteNoteByIdHandler = (request, h) => {
	const { id } = request.params;

	const index = notes.findIndex((note) => note.id === id);

	if (index !== -1) {
		notes.splice(index, 1);
		const response = h.response({
			status: 'success',
			message: 'Catatan berhasil dihapus',
		});
		response.code(200);
		return response;
	} else {
		const response = h.response({
			status: 'fail',
			message: 'Catatan gagal dihapus. Id tidak ditemukan',
		});
		response.code(404);
		return response;
	}
};

module.exports = {
	getAllNotesHandler,
	addNoteHandler,
	getNoteByIdHandler,
	editNoteByIdHandler,
	deleteNoteByIdHandler,
};
