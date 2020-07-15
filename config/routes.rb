Rails.application.routes.draw do
  # get 'welcome/index'
  root 'welcome#index'

  get 'database/tc'
  get 'database/fc'
  get 'database/aa'
  mount Deltadb::Engine => "/db"
end
