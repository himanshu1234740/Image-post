const Blog = require('../model/model');
const register = require('../model/register');
const bcrypt = require('bcrypt');
const localstorage = require('node-localstorage');



exports.create = (req, res) => {
    if (!req.body) {
        res.status(404).send({ message: 'connect and not be find' });
        return;
    }


    const users = new Blog({
        img: req.file.filename,
        desc: req.body.desc,
        title: req.body.title,
        id: req.cookies.id

    })

    users.save(users).then((data) => {
        res.send(data)
        // res.redirect('/')
    }).catch(err => {
        console.log(err);
    })
}
exports.read = (req, res) => {
    if (req.query.id) {
        let id = req.query.id;
        Blog.findById(id).then((data) => {
            res.send(data);
        }).catch(err => {
            console.log(err);
        })
    }

    else {
        Blog.find().then((user) => {
            res.send(user)
        }).catch(err => {
            console.log(err);
        })
    }

}

exports.delete = (req, res) => {
    const id = req.params.id;
    Blog.findByIdAndRemove(id).then((data) => {
        if (!data) {
            res.status(404).send({ message: `cannot be delete this ${id}` })
        } else {
            res.send({ message: "delete successfully" })
        }

    }).catch(function (err) {
        res.send({ message: err.message })
    })

}
exports.update = (req, res) => {
    const { desc, title } = req.body;
    let img = req.file.filename;
    const updatedPost = { img, desc, title };
    if (!req.body) {
        res.status(404).send({ masssage: `cannot be empty` })
        return;
    }
    const id = req.params.id;
    console.log(updatedPost);
    Blog.findByIdAndUpdate(id, updatedPost, { new: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })

}

//here we are write post request to register user
exports.post = (req, res) => {
    if (!req.body) {
        res.status(404).send({ message: `field con not be empty` })
        return;
    }
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const email = req.body.email;
    register.findOne({ email: email }).then((data) => {
        if (!data) {
            if (password === cpassword) {
                const reg = new register({
                    user: req.body.user,
                    email: req.body.email,
                    password: req.body.password,
                    cpassword: req.body.cpassword,

                })

                reg.save(reg).then((data) => {
                    res.send(data);
                }).catch(err => {
                    console.log(err);
                })
            } else {
                res.send("password does not match")
            }
        } else {
            res.send("Account Already Exists")
        }
    }).catch((err) => {
        console.log(err);
    })

}
exports.readuser = (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;

    register.findOne({ email }).then((data) => {


        const ismatch = bcrypt.compareSync(password, data.password);
        const token = data.registerToken();

        res.cookie('jwt', token)
        const id = data['id'].toString();
        res.cookie('id', id);

        if (ismatch) {

            res.status(200).send(data);
        } else {
            res.send("invalid response")
        }

    }).catch((err) => {
        res.send("err")
    })


}

exports.profile = (req, res) => {
    
    register.find().then((data) => {
        res.send(data)
    }).catch((err) => {
        console.log(err)
    })
}

exports.profileUpdate = (req, res) => {

    const user = req.body.user;
    const email = req.body.email;
    const id = req.params.id;

    console.log(user, email, id);
    register.findOne({email}).then((data) => {
        if (!data){
            register.findByIdAndUpdate(id, { user, email }, { new: true }).then(data => {
                if (!data) {
                    res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
                } else {
                    res.send(data)
                }
            })
                .catch(err => {
                    res.status(500).send({ message: "Error Update user information" })
                })
        }else{
            res.send("invalid")
        }
    })
   
}

exports.getRegistrUser = (req, res) => {
    const email = req.body.email
    register.findOne({ email }).then((data) => {

        res.send(data)

    }).catch((err) => {
        res.send('err')
    })
}

exports.forget = (req, res) => {

    const id = req.params.id;
    const userpassword = req.body.password;
    const usercpassword = req.body.cpassword;
    if (userpassword === usercpassword) {
        const password = bcrypt.hashSync(userpassword, 10);
        const cpassword = bcrypt.hashSync(usercpassword, 10);
        register.findByIdAndUpdate(id, { password, cpassword }, { new: true }).then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(data)
            }
        })
            .catch(err => {
                res.status(500).send({ message: "Error Update user information" })
            })
    } else {
        res.send("notMatch")
    }
}







