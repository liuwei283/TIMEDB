class WelcomeController < ApplicationController
  def index
    if session[:visitorid].blank?
      visitor = Visitor.create
      session[:visitorid] = visitor.id
    end
    Rails.logger.debug("=====>>>>#{session[:visitorid]}<<<<")
  end

  # def tutorial
  # end

  def contact
  end
end
