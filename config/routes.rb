Rails.application.routes.draw do

  get 'discrete_heatmap/index'
  resources :projects do
    resources :samples do
      collection { post :import }
      collection { post :export_selected}
      member { post :upload_seq }
      member { post :upload_abd }
      member { get :download_seq }
      member { get :download_abd }
    end
    collection { post :import }
    collection { post :export_selected }
  end
  # get 'welcome/index'
  root 'welcome#index'
  # get 'tutorial', to: 'welcome#tutorial', as: 'tutorial'
  get 'contact', to: 'welcome#contact', as: 'contact'
  get 'docs', to: redirect('docs/index.html')

  # read local csv file 
  # get 'data/:name', to: 'raw_files#index'
  get 'api/public', to: 'raw_files#public'
  post 'data/multiple', to: 'raw_files#index'

  # database pages
  get 'database/sample'
  get 'database/tc'
  get 'database/char'
  get 'database/fc'
  get 'database/aa'
  
  # submit pages
  get 'submit/:id', to: 'submit#index', as: 'submit'
  get 'job-query', to: 'submit#query', as: 'query'
  get 'viz', to: 'submit#viz'
  post 'submit-app-task', to: 'submit#submit_app_task', format: 'json'
  post 'query-app-task', to: 'submit#query_app_task', format: 'json'
  mount Deltadb::Engine => "/db"
end
