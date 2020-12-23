class ApplicationController < ActionController::Base
    before_action :require_cookie

    private

    def require_cookie
        unless session[:user_id]
            @user = User.new
            @user.dataset_n = 0
            @user.save
            session[:user_id] = @user.id
            user_dir = File.join($user_stor_dir, @user.id.to_s)
            unless File.directory?(directory)
                Dir.mkdir(user_dir)
            end
        end
    end
end
