class ApplicationController < ActionController::Base
    before_action :require_cookie

    $user_stor_dir = "#{Rails.root}/data/user" 

    def validate_cookie
        # logger.error !params[:controller] == 'welcome'
        # logger.error "----------------------------------"
        # logger.error session[:user_id]
        # check if guest user has not already accepted the toc from session
        if session[:user_id].nil?
            redirect_to root_path, alert: 'Please accept cookie to continue.' 
            logger.error params[:user_id]
            logger.error "----------------------------------"

        end
    end

    def require_cookie
        # no cookie found 
        logger.error "----------------------------------"
        logger.error "----------------------------------"

        unless session[:user_id]
            @user = User.new
            @user.dataset_n = 0
            @user.save
            session[:user_id] = @user.id
            
        end
        # check user
        id = session[:user_id]
        if User.exists? id
            
            @user = User.find(id)
            @user.touch

        else 
            # already expired
            @user = User.new
            @user.dataset_n = 0
            @user.save
            session[:user_id] = @user.id
            
        end
        logger.error session[:user_id]
        
        #user_dir = File.join($user_stor_dir, session[:user_id].to_s)  
        # unless File.directory?(user_dir)
        #     Dir.mkdir(user_dir)
        # end
    end
end
