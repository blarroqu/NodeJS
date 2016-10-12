#!/usr/bin/env node
const inquirer = require('inquirer')
const db = require('sqlite')
const program = require('commander')
const fs = require('fs')



//config paramètres attendus
program
	.version('1.0.0')
	.option('-f, --facile', 'niveau de jeu : facile')
	.option('-m, --moyen', 'niveau de jeu : moyen')
	.option('-d, --difficile', 'niveau de jeu : difficile')

//on parse (convertit en format utilisable) les options

//fonction synchrone
program.parse(process.argv)

//Maintenant on peut les utiliser
if (program.facile) {
	console.log('niveau facile')
	//recup DB facile
	niveau('facile')
} else if (program.moyen) {
	console.log('niveau moyen')
	//recup DB moyen
	niveau('moyen')
} else if (program.difficile) {
	console.log('niveau difficile')
	//recup DB difficile 
	niveau('difficile')
} else {
	program.help()
}




/*********FONCTION NIVEAU************/

function niveau(lvl){

	//récupération des questions de la DB correspondant au niveau
	db.open(lvl + '.db').then(() => {
		db.all("SELECT rowid AS id, question AS q, a, b, c, d, reponse AS r FROM qr").then((tab) => {

  			var i = 0 //compteur de question /20
	   		question(tab, i) //on passe en parametre le compteur i et le tableau contenant les questions

  		}).catch((err) => { // Si on a eu des erreurs
  			console.error('ERR> ', err)
		})	
	}).catch((err) => { // Si on a eu des erreurs
		console.error('ERR> ', err)
	})	

}  
 


/*********FONCTION QUESTION************/


function question(tab, i){

	var row = tab[i] //recup une question

	// construction question a afficher
	var mess = (row.id + ": " + row.q + "\nA:" + row.a + " \nB:" + row.b + " \nC:" + row.c + " \nD:" + row.d + "\n\nReponse ? (a/b/c/d)") 

	var bonneReponse = row.r // bonne reponse à la question

	//variable qui recup la reponse
	var reponse = [
		{
			type: 'input',
			message: mess,
			name: 'reponse',
		}
	]

	//pose la question et attend la reponse
	inquirer.prompt(reponse).then((answer) => {
		
		// si bonne reponse question suivante
		if(answer.reponse == bonneReponse){
			i++
			if(i<=19){
				question(tab, i)
			}
			//repondu à toutes les questions correctement
			else {
				console.log("YOU WIN !")
				resultat(i)
			}
		}
		//erreur du joueur
		else{
			console.log("GAME OVER !")
			resultat(i)
		}
	}).catch((err) => { // Si on a eu des erreurs
		console.error('ERR> ', err)
	})	
}

/*********FONCTION RESULTAT************/
//écris dans le fichier Gain.txt le montant gagné et l'affiche

function resultat(i){
	try {
	//Ecrire un les gains dans le fichier Gain.txt
	fs.writeFile('Gain.txt', i*i +'€', (err) => {
		if(err) throw err
	})

	//Lire le fichier pour afficher les gains
	fs.readFile('Gain.txt', 'utf8', (err, data) => {
		if(err) throw err
			console.log('Vous avez gagné : ' + data)
	})
} catch (err) {
	console.log('ERR > ', err)
}
}


