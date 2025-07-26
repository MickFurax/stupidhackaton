import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4"><img src="/logo.png" alt="" className="w-40 h-40 mx-auto" /></div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur E-caca
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          L'application ultime pour noter et partager vos expériences dans les toilettes ! 
          Découvrez les meilleurs (et les pires) endroits où faire ses besoins, 
          partagez vos aventures et aidez la communauté à trouver les WC parfaits.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card p-6">
          <div className="text-3xl mb-4">📍</div>
          <h3 className="text-xl font-semibold mb-3">Notez vos endroits</h3>
          <p className="text-gray-600">
            Partagez vos expériences dans différents types de toilettes : 
            WC publiques, dans la nature, chez des amis, ou même dans des canaux !
          </p>
        </div>

        <div className="card p-6">
          <div className="text-3xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold mb-3">Système de notation</h3>
          <p className="text-gray-600">
            Évaluez la propreté, le confort et même le niveau de danger de chaque endroit 
            pour aider les autres utilisateurs.
          </p>
        </div>

        <div className="card p-6">
          <div className="text-3xl mb-4">📸</div>
          <h3 className="text-xl font-semibold mb-3">Ajoutez des photos</h3>
          <p className="text-gray-600">
            Immortalisez vos découvertes avec des photos pour donner un aperçu 
            visuel aux autres utilisateurs.
          </p>
        </div>

        <div className="card p-6">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="text-xl font-semibent mb-3">Consultez l'historique</h3>
          <p className="text-gray-600">
            Retrouvez tous vos spots favoris et découvrez les endroits les mieux notés 
            par la communauté.
          </p>
        </div>
      </div>

      <div className="text-center">
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to="/add"
            className="btn-primary inline-block text-center min-w-[200px]"
          >
            🚽 Ajouter un endroit
          </Link>
          <Link
            to="/history"
            className="btn-secondary inline-block text-center min-w-[200px]"
          >
            📋 Voir l'historique
          </Link>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-500">
        <p className="text-sm">
          💩 Fait avec amour (et beaucoup d'humour) pour la communauté des aventuriers des toilettes 💩
        </p>
      </div>
    </div>
  )
}

export default Home