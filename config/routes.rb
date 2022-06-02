Rails.application.routes.draw do

  get 'debug', to: 'debug#index'
  post 'debug', to: 'debug#add'
  get 'debug/delete/:id', to: 'debug#delete'
  post '/submit/analysis/:str', to: 'submit#handler'
  get '/submit/analyses/:id', to: 'submit#analyses'


  resources :projects do
    resources :samples do
      collection do
        post :import
        post :import_inf_table
      end
      member do
        post :upload_seq
        post :upload_inf
        get :download_seq
        get :download_inf
      end
    end
    collection { post :import}
    collection { post :download_selected_file }
    collection { post :export_selected }
    member { post :download_inf_table} 
  end

  resources :samples do
    collection do
      post :make_selected_file
    end
  end

  resources :organs do
    collection { post :import }
    collection { post :export_selected }
  end

  resources :cancers do
    collection { post :import }
    collection { post :export_selected }
  end

  resources :users do
    resources :datasets do
      member { post :upload_file }
      member { get :download_file}
      member { get :download_ds_inf}
      member { get :download_ds_metadata}
      member { post :delete_sample}
    end
  end
  
  root 'welcome#index'

  get 'tutorial', to: 'welcome#tutorial', as: 'tutorial'
  get 'contact', to: 'welcome#contact', as: 'contact'
  get 'docs', to: redirect('docs/index.html')

  # read local csv file 
  # get 'data/:name', to: 'raw_files#index'
  get 'api/local', to: 'raw_files#index'
  get 'api/public', to: 'raw_files#public'

  # draw on overview page
  namespace :api do
    resources :analysis, only: [] do
      get 'use_demo', to: 'viz_files#use_demo', as: 'use_demo'
      get 'use_task_output', to: 'viz_files#use_task_output', as: 'use_task_output'
      get 'all_files', to: 'viz_files#all_files', as: 'all_files'
      get 'all_task_outputs', to: 'viz_files#all_task_outputs', as: 'all_task_outputs'
      get 'chosen_files', to: 'viz_files#get_chosen_files', as: 'chosen_files'
      get 'chosen_file_paths', to: 'viz_files#chosen_file_paths', as: 'chosen_file_paths'
      get 'download_demo_file', to: 'viz_files#download_demo_file', as: 'download_demo_file'
      post 'chosen_files', to: 'viz_files#update_chosen_files', as: 'update_chosen_files'
      post 'create_files', to: 'viz_files#create_files', as: 'create_files'
      post 'batch_delete_files', to: 'viz_files#batch_delete_files', as: 'batch_delete_files'
    end
    get "public_file/check_file_exists", to: 'public_file#check_file_exists', as: 'json'
    get 'tabix/:url_name', to: 'tabix_apis#show', as: 'tabix_api'
    get 'public/:url_name', to: 'public_file_apis#show', as: 'public_api'
  end

  # database pages
  get 'database/overview', to: 'database#overview'
  get 'user/show', to: 'users#show'
  # get 'demo', to: 'demo#show'
  #post 'welcome/accept_cookies', to: 'welcome#require_cookie'
  post "welcome/require_cookie", to: "welcome#require_cookie", as: "require_cookie"
  
  # visualizer
  scope '/visualizer' do
    # resources :analysis, except: :index
    get 'analysis/:url_name', to: 'analysis#show', as: 'analysis'
  end
  get 'visualizer', to: "analysis#index", as: "visualizer"


  # submit pages
  get "submit/analyses", to: "submit#analyses"
  get "submit/analysesCategory", to: "submit#analysesCategory"
  get "submit/pipelines", to: "submit#pipelines"
  get 'submit/job-query', to: 'submit#query', as: 'query'
  get "submit/job-demo", to: "submit#demo"
  get 'submit/analysis/:id', to: 'submit#index', as: 'submit_analysis'
  get 'submit/pipeline/:id', to: 'submit#pipeline', as: 'submit_pipeline'
  post 'change_dark', to:'application#change_dark'

  post 'query-app-task', to: 'submit#query_app_task', format: 'json'
    post 'query-app-task-dummy', to: 'submit#query_app_task_dummy'
  post 'query-demo-tasks', to: 'submit#query_demo_tasks', format: 'json'
  post 'submit-app-task', to: 'submit#submit_app_task', format: 'json'
  post 'query-demo-task', to: 'submit#query_demo_task', format: 'json'
  post 'query-all-tasks', to: 'submit#query_all', format: 'json'
  post 'remove-task', to: 'submit#remove_task', format: 'json'

  # get "debug", to: "submit#query_app_task_test"
  # post 'query_app_task_dummy', to: 'submit#query_app_task_dummy'
  # post 'submit_app_task_dummy', to: 'submit#submit_app_task_dummy'
  # post 'submit-app-task', to: 'submit#submit_app_task', format: 'json'
  # post 'submit-app-task-dummy', to: 'submit#submit_app_task_dummy', format: 'json'

  # admin
  get '/admin', to: 'admin#index', as: "admin_index"
  post "admin/modify_sample_metadata" => "admin#modify_sample_metadata", :as => "admin/modify_sample_metadata"
  post "admin/modify_sample_inf" => "admin#modify_sample_inf", :as => "admin/modify_sample_inf"
  post "admin/update_samples_num_table_and_reprocessedColumns" => "admin#update_samples_num_table_and_reprocessedColumns", :as => "admin/update_samples_num_table_and_reprocessedColumns"
  post "admin/make_analysis_cancer_files" => "admin#make_analysis_cancer_files", :as => "admin/make_analysis_cancer_files"
  post "admin/make_subtype_cancer_files" => "admin#make_subtype_cancer_files", :as => "admin/make_subtype_cancer_files"
  post "admin/update_columns" => "admin#update_columns", :as => "admin/update_columns"


  post "admin/modify_viz" => "admin#modify_viz", :as => "admin/modify_viz"
  post "admin/modify_ana_cate" => "admin#modify_ana_cate", :as => "admin/modify_ana_cate"
  post "admin/modify_ana" => "admin#modify_ana", :as => "admin/modify_ana"
  post "admin/modify_viz_source" => "admin#modify_viz_source", :as => "admin/modify_viz_source"
  post "admin/add_img" => "admin#add_img", :as => "admin/add_img"
  post "admin/delete_samples" => "admin#delete_samples", :as => "admin/delete_samples"
  post "admin/update_all_samples" => "admin#update_all_samples", :as => "admin/update_all_samples"
  post "admin/update_all_organs" => "admin#update_all_organs", :as => "admin/update_all_organs"
  post "admin/update_all_cancers" => "admin#update_all_cancers", :as => "admin/update_all_cancers"



  namespace :admin do
    post :update_analysis_category_position, to: 'analysis_categories#update_position'
    resources :analysis_categories, except: :show do
      post :update_position, to: 'analyses#update_position', as: 'update_analysis_position'
      resources :analyses, expect: %i[index show]
    end
    get 'analyses', to: 'analyses#index'
    resources :visualizers
    resources :analysis_pipelines
    resources :tasks, except: :new
    post "clear_outputs", to:"tasks#clear_outputs", as: "clear_outputs"
    post "set_demo_task", to:"tasks#set_demo_task", as: "set_demo_task"
    resources :file_keys, except: :show
    resources :tabix_apis, except: :show
  end

  # serve files
  match 'data/uploads/*path', to: 'raw_files#uploads', as: 'get_uploads', via: :get
  match 'data/demo/*path', to: 'raw_files#demo', as: 'get_demo', via: :get
  match 'data/outputs/*path', to: 'raw_files#outputs', as: 'get_outputs', via: :get
  match 'data/static_viz_data/*path', to: 'raw_files#viz_file', via: :get
  match 'public/data/*path', to: 'raw_files#public_file', via: :get
  match 'public/data/sample_plot/*path', to: 'raw_files#viz_inf_file', via: :get
  get "/database/refreshSelector", to: 'database#refreshSelector'

  post 'query-deepomics', to: 'submit#query_deepomics', format: 'json'


end
