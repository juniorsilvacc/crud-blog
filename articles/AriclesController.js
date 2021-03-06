const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");


router.get("/admin/articles", (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles})
    });
});

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories})
    })
});

router.post("/articles/save", (req, res) => {
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.create({
        title,
        slug: slugify(title),
        body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    })
});

router.post("/articles/delete", (req, res) => {
    const id = req.body.id;
    if(id != undefined){

        if(!isNaN(id)){

            Article.destroy({
                where: {
                    id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            })

        } else { //Se não for um numero
            res.redirect("/admin/articles");
        }

    } else { //Se for null
        res.redirect("/admin/articles");
    }
});


router.get("/admin/articles/edit/:id", (req, res) => {
    const id = req.params.id;
    
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {categories, article})
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/articles/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.update({title, body, categoryId: category, slug:slugify(title)}, {
        where: {
            id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

router.get("/articles/page/:num", (req, res) => {
    const page = req.params.num;
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;  
    } else {
        offset = (parseInt(page) -1 ) * 4;
    }
    Article.findAndCountAll({
        limit: 4,
        offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        let next;

        if(offset + 4 >= articles.count){
            next = false;
        } else {
            next = true;
        }

        const result = {
            page: parseInt(page),
            next,
            articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result, categories})
        });

        // res.json(result);
    })
});

module.exports = router;