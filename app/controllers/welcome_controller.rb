class WelcomeController < ApplicationController
  $user_stor_dir = "#{Rails.root}/data/user"
  def index
    # check user
    if session[:user_id]
      @user = User.find(session[:user_id])
    else
      @user = User.new
      @user.dataset_n = 0
      @user.save
      session[:user_id] = @user.id
      user_dir = File.join($user_stor_dir, @user.id.to_s)
      Dir.mkdir(user_dir)
    end
    user_dir = File.join($user_stor_dir, @user.id.to_s)
    @dataset_list = @user.datasets
  end

  # def tutorial
  # end

  def contact
  end
end
