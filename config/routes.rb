Rails.application.routes.draw do
  # get 'welcome/index'
  root 'welcome#index'

  # database pages
  get 'database/tc'
  get 'database/fc'
  get 'database/aa'
  
  # submit pages
  get 'submit/:id', to: 'submit#index', as: 'submit'
  get 'job-query', to: 'submit#query', as: 'query'
  post 'submit-app-task', to: 'submit#submit_app_task', format: 'json'
  mount Deltadb::Engine => "/db"
end
