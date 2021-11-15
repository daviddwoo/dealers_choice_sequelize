const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize_db');
const { STRING, UUID, UUIDV4 } = Sequelize.DataTypes;

// Sequelize Models - For Schools, Majors, and Students
const School = conn.define('school', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

const Student = conn.define('student', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

const Major = conn.define('major', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

// Associations
Student.belongsTo(Student, {as: 'classMates'});
Student.belongsTo(School, { as: 'enrolledSchool' });
Student.belongsTo(Major, { as: 'majorEnrolled' });
Major.hasMany(Student, { foreignKey: 'majorEnrolledId' });
School.hasMany(Student, { foreignKey: 'enrolledSchoolId' });
Student.hasMany(Student, { foreignKey: 'classMatesId'});

const data = {
    schools: ['Rutgers University', 'NYU', 'UCLA'],
    majors: ['Engineering', 'Business', 'Communications', 'Computer Science', 'Biology'],
    students: ['David', 'Theodore', 'Vegeta', 'Michelle', 'Jenny']
}

const syncAndSeed = async() => {
    try {
        await conn.sync({force:true});
        const [rutgers, nyu, ucla] = await Promise.all(data.schools.map((name) => School.create({name})));
        const [engineering, business, comm, compSci, bio] = await Promise.all(data.majors.map((name) => Major.create({name})));
        const [david, theo, vegeta, michelle, jenny] = await Promise.all(data.students.map((name) => Student.create({name})));
        
        await Promise.all([
            david.update({enrolledSchoolId: rutgers.id, majorEnrolledId: engineering.id, classMatesId: vegeta.id}),
            theo.update({enrolledSchoolId: nyu.id, majorEnrolledId: business.id, classMatesId: michelle.id}),
            vegeta.update({enrolledSchoolId: rutgers.id, majorEnrolledId: bio.id, classMatesId: david.id}),
            michelle.update({enrolledSchoolId: nyu.id, majorEnrolledId: compSci.id, classMatesId: theo.id}),
            jenny.update({enrolledSchoolId: ucla.id, majorEnrolledId: comm.id})
        ]);
    }
    catch(ex) {
        console.log(ex);
    }
}

module.exports = {
    syncAndSeed,
    models: {
        School,
        Student,
        Major
    }
}