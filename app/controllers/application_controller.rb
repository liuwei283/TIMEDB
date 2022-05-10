class ApplicationController < ActionController::Base
    before_action :validate_cookie

    $user_stor_dir = "#{Rails.root}/data/user" 

    def validate_cookie
        # logger.error !params[:controller] == 'welcome'
        # logger.error "----------------------------------"
        # logger.error session[:user_id]
        # check if guest user has not already accepted the toc from session
        logger.error session[:user_id]
        if session[:user_id].nil?
            redirect_to root_path, alert: 'Please accept cookie to continue.'
            logger.error params[:user_id]
            logger.error "----------------------------------"
            logger.error "----------------------------------"
            logger.error "----------------------------------"
            logger.error "application controller validate cookie"
            logger.error session[:user_id]
        end
    end

    
end
