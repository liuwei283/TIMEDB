class WelcomeController < ApplicationController
  $user_stor_dir = "#{Rails.root}/data/user"
  def index
    # check user
    if cookies.encrypted[:user]
      @user = User.find(cookies.encrypted[:user])
    else
      @user = User.new
      @user.dataset_n = 0
      @user.save
      cookies.encrypted[:user] = @user.id
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
