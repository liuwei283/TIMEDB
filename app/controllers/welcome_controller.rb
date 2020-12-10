class WelcomeController < ApplicationController
  $user_stor_dir = "/Users/CHE/platform/user_meta"
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
    if @user.task_ids
      @task_list = @user.task_ids.split(',')
    else
      @task_list = []
    end
  end

  # def tutorial
  # end

  def contact
  end
end
