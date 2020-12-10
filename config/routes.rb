Rails.application.routes.draw do

  resources :projects do
    resources :samples do
      collection { post :import }
      collection { post :make_selected_file}
      collection { post :import_abd_table}
      member { post :upload_seq }
      member { post :upload_abd }
      member { get :download_seq }
      member { get :download_abd }
    end
    collection { post :import}
    collection { post :download_selected_file }
    collection { post :export_selected }
    member { post :download_abd_table} 
  end

  resources :users do 
    resources :datasets do
      member { post :upload_file }
      member { get :download_file}


    end
  end

  # get 'welcome/index'
  root 'welcome#index'
  # get 'tutorial', to: 'welcome#tutorial', as: 'tutorial'
  get 'contact', to: 'welcome#contact', as: 'contact'
  get 'docs', to: redirect('docs/index.html')

  # read local csv file 
  # get 'data/:name', to: 'raw_files#index'
  get 'api/local', to: 'raw_files#index'
  get 'api/public', to: 'raw_files#public'

  namespace :api do
    resources :analyses, only: [] do
      get 'all_files', to: 'viz_files#all_files', as: 'all_files'
      get 'chosen_files', to: 'viz_files#get_chosen_files', as: 'chosen_files'
      get 'chosen_file_paths', to: 'viz_files#chosen_file_paths', as: 'chosen_file_paths'
      post 'chosen_files', to: 'viz_files#update_chosen_files', as: 'update_chosen_files'
      post 'create_files', to: 'viz_files#create_files', as: 'create_files'
    end
  end
  # database pages
  get 'database/sample'
  get 'database/tc'
  get 'database/char'
  get 'database/fc'
  get 'database/aa'
  
  get 'demo', to: 'demo#show'
  
  scope '/visualizer' do
    resources :analysis
  end

  # submit pages
  get 'submit/viz', to: 'submit#viz'
  get 'submit/:id', to: 'submit#index', as: 'submit'
  get 'job-query', to: 'submit#query', as: 'query'
  
  post 'submit-app-task', to: 'submit#submit_app_task', format: 'json'
  post 'query-app-task', to: 'submit#query_app_task', format: 'json'
  post 'query-app-task-dummy', to: 'submit#query_app_task_dummy', format: 'json'
  mount Deltadb::Engine => "/db"
end
