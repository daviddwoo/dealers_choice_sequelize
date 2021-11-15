const express = require('express');
const app = express();
const { syncAndSeed, models: {School, Student, Major}} = require('./db');

app.get('/students', async(req, res, next) => {
    try {
        const students = await Student.findAll({
            include: {
              model: Student,
              as: 'classMates'
            }
          }
        );
        res.send(students);
    }
    catch(ex) {
        next(ex);
    }
});

app.get('/majors', async(req, res, next) => {
    try {
        const majors = await Major.findAll({
            include: [Student]
        })
        res.send(majors);
    }
    catch(ex) {
        next(ex);
    }
});

app.get('/schools', async(req, res, next) => {
    try {
        const schools = await School.findAll({
            include: [Student]
        })
        res.send(schools);
    }
    catch(ex) {
        next(ex);
    }
});

const init = async() => {
    try {
        await syncAndSeed();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
    }
    catch(ex) {
        console.log(ex);
    }
}

init();