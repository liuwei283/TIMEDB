class Visitor < ApplicationRecord
  has_many :viz_file_objects, dependent: :destroy
  has_many :analysis_user_data, dependent: :destroy
    def self.find_visitor(session_str)
        Rails.logger.debug("====>#{session_str}<====")
        if Visitor.exists?(session_string: session_str)
            visitor = Visitor.find_by(session_string: session_str)
        else
            visitor = Visitor.new(session_string: session_str)
        end
    end
end
