class WelcomeController < ApplicationController
  $user_stor_dir = "#{Rails.root}/data/user"
  def index
    @user = User.find(session[:user_id])
    user_dir = File.join($user_stor_dir, @user.id.to_s)
    @dataset_list = @user.datasets
  end

  # def tutorial
  # end

  def contact
  end
end
