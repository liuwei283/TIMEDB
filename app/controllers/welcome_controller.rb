class WelcomeController < ApplicationController
  def index
    @user = User.find(session[:user_id])
    @dataset_list = @user.datasets
  end

  # def tutorial
  # end

  def contact
  end
end
