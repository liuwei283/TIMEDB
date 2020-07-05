Rails.application.routes.draw do
  get 'welcome/index'

  mount Deltadb::Engine => "/db"
end
